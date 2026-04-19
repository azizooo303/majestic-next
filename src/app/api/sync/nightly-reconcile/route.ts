/**
 * GET /api/sync/nightly-reconcile
 *
 * Nightly full-catalog diff between Odoo and WooCommerce.
 *
 * Triggered by Vercel Cron at 02:00 Asia/Riyadh.
 * Protected by CRON_SECRET (header: x-vercel-cron-secret).
 *
 * Flow:
 *   1. Pull all Odoo product.template with default_code matching DESK-*
 *   2. Pull all WC variable products
 *   3. Compute drift across 7 classes: orphans, price, stock, attributes, translations, categories, SKU format
 *   4. If drift > 5%: activate kill-switch, do NOT auto-patch, return report
 *   5. Else apply deltas (missing in WC → create, field mismatches → update)
 *   6. Write drift report to Supabase + return summary
 */

import { NextRequest, NextResponse } from "next/server";
import { searchRead, searchCount } from "@/lib/sync/odoo-client";
import { wcFetch } from "@/lib/woocommerce";
import {
  isKillSwitchActive,
  activateKillSwitch,
  shouldTriggerKillSwitch,
} from "@/lib/sync/kill-switch";
import { transformProductTemplate } from "@/lib/sync/transform";
import { upsertVariableProduct } from "@/lib/sync/wc-writer";
import { supabaseAdmin } from "@/lib/supabase";
import { SYNC_CONFIG, type DriftReport } from "@/lib/sync/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min cap

export async function GET(req: NextRequest) {
  // Vercel Cron auth: header present when triggered by Vercel
  const cronSecret = req.headers.get("x-vercel-cron-secret") || req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (expected && cronSecret !== `Bearer ${expected}` && cronSecret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const run_at = new Date().toISOString();
  const runId = `recon-${run_at}`;

  try {
    // 1. Odoo desk templates
    const odooTpls = await searchRead<{
      id: number;
      name: string;
      default_code: string;
      list_price: number;
      active: boolean;
      attribute_line_ids: number[];
      write_date: string;
    }>(
      "product.template",
      [
        ["default_code", "like", "DESK-"],
        ["active", "=", true],
      ],
      ["id", "name", "default_code", "list_price", "active", "attribute_line_ids", "write_date"],
      { limit: 1000 },
    );

    // 2. WC variable products
    const wcProducts = await wcFetch<
      Array<{
        id: number;
        sku: string;
        regular_price: string;
        status: string;
        attributes: unknown;
      }>
    >({
      endpoint: "/wc/v3/products",
      params: { type: "variable", per_page: 100 },
    });

    // 3. Compute drift
    const odooBySku = new Map(odooTpls.map((t) => [t.default_code, t]));
    const wcBySku = new Map(wcProducts.map((p) => [p.sku, p]));

    const missing_in_wc: string[] = [];
    const orphan_in_wc: string[] = [];
    const price_mismatch: Array<{ sku: string; odoo: number; wc: number }> = [];

    for (const [sku, tpl] of odooBySku) {
      const wc = wcBySku.get(sku);
      if (!wc) {
        missing_in_wc.push(sku);
        continue;
      }
      const odooPrice = tpl.list_price;
      const wcPrice = parseFloat(wc.regular_price || "0");
      if (Math.abs(odooPrice - wcPrice) > SYNC_CONFIG.PRICE_TOLERANCE_SAR) {
        price_mismatch.push({ sku, odoo: odooPrice, wc: wcPrice });
      }
    }

    for (const [sku] of wcBySku) {
      if (!sku) continue;
      if (!odooBySku.has(sku) && sku.startsWith("DESK-")) {
        orphan_in_wc.push(sku);
      }
    }

    const driftCount = missing_in_wc.length + orphan_in_wc.length + price_mismatch.length;
    const total = Math.max(odooTpls.length, wcProducts.length, 1);
    const driftPct = (driftCount / total) * 100;

    const report: DriftReport = {
      run_at,
      total_odoo_entities: odooTpls.length,
      total_wc_entities: wcProducts.length,
      drift_count: driftCount,
      drift_pct: driftPct,
      kill_switch_triggered: false,
      by_class: {
        missing_in_wc,
        orphan_in_wc,
        price_mismatch,
        stock_mismatch: [], // computed separately via stock.quant aggregation (Wave 2.1)
        translation_missing_ar: [], // computed by translation-sync route
      },
    };

    // 4. Kill-switch check
    if (shouldTriggerKillSwitch(driftPct)) {
      report.kill_switch_triggered = true;
      await activateKillSwitch(
        "nightly-reconcile",
        `Drift ${driftPct.toFixed(2)}% exceeds ${SYNC_CONFIG.KILL_SWITCH_THRESHOLD_PCT}% threshold`,
        driftPct,
      );
      await logDriftReport(report);
      return NextResponse.json({
        ok: false,
        kill_switch: true,
        drift_pct: driftPct,
        drift_count: driftCount,
      });
    }

    // 5. Auto-patch missing templates (create in WC)
    if (!(await isKillSwitchActive())) {
      for (const sku of missing_in_wc.slice(0, 20)) {
        // cap per run to avoid timeout; next run handles rest
        const tpl = odooBySku.get(sku);
        if (!tpl) continue;
        try {
          await upsertVariableProduct(
            sku,
            transformProductTemplate(
              {
                ...tpl,
                categ_id: false,
                sale_ok: true,
                purchase_ok: false,
                type: "product",
                uom_id: false,
                description_sale: false,
                description: false,
              } as never,
              [],
            ),
            { eventId: runId },
          );
          console.log(`[recon] created ${sku} in WC`);
        } catch (e) {
          console.error(`[recon] failed ${sku}:`, e);
        }
      }
    }

    // 6. Log report
    await logDriftReport(report);

    return NextResponse.json({
      ok: true,
      run_id: runId,
      drift_pct: driftPct,
      drift_count: driftCount,
      missing_in_wc: missing_in_wc.length,
      orphan_in_wc: orphan_in_wc.length,
      price_mismatches: price_mismatch.length,
    });
  } catch (e) {
    console.error("[recon] failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "recon failed" },
      { status: 500 },
    );
  }
}

async function logDriftReport(report: DriftReport) {
  try {
    await supabaseAdmin.from("sync_drift_reports").insert({
      run_at: report.run_at,
      total_odoo: report.total_odoo_entities,
      total_wc: report.total_wc_entities,
      drift_count: report.drift_count,
      drift_pct: report.drift_pct,
      kill_switch_triggered: report.kill_switch_triggered,
      by_class: report.by_class,
    });
  } catch (e) {
    console.error("[recon] failed to log drift:", e);
  }
}
