/**
 * POST /api/sync/translation-sync
 *
 * Maintains Polylang EN + AR twin products in WC.
 *
 * Called by odoo-webhook after a template upsert, OR manually/cron to backfill missing twins.
 *
 * Rules (Aziz 2026-04-20):
 *   - Every product has BOTH EN and AR twins always
 *   - If Odoo has AR content → use it
 *   - If Odoo AR is missing → AR twin uses EN as placeholder + meta_data._translation_pending=true
 *   - sync-validator tracks missing-AR as P2 translation work queue
 *
 * Flow:
 *   1. Fetch Odoo template with translated fields (AR via context={'lang': 'ar_001'})
 *   2. Check if EN twin exists in WC → create/update
 *   3. Check if AR twin exists → create/update (with placeholder flag if AR empty)
 *   4. Link via Polylang endpoint (custom /majestic/v1/polylang/set-post-translations)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyHmac } from "@/lib/sync/hmac";
import { odooCall, read } from "@/lib/sync/odoo-client";
import { wcFetch } from "@/lib/woocommerce";
import { transformProductTemplate } from "@/lib/sync/transform";
import { upsertVariableProduct } from "@/lib/sync/wc-writer";
import type { WCVariableProduct } from "@/lib/sync/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Payload {
  template_ids?: number[];   // Odoo product.template IDs
  mode?: "backfill" | "single";
  skus?: string[];           // alternative: SKUs to re-sync
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-odoo-signature") || "";

  // Allow internal calls without signature (from our own odoo-webhook route) if an internal header is set
  const isInternal = req.headers.get("x-internal-call") === process.env.INTERNAL_SYNC_TOKEN;
  if (!isInternal && !verifyHmac(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: Payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const ids = payload.template_ids || [];
  const results: Array<{ sku: string; en: "ok" | "fail"; ar: "ok" | "placeholder" | "fail"; error?: string }> = [];

  for (const tplId of ids) {
    try {
      // Fetch EN
      const enTpl = (
        await read<{
          id: number;
          name: string;
          default_code: string | false;
          list_price: number;
          description_sale: string | false;
          write_date: string;
          active: boolean;
          attribute_line_ids: number[];
        }>("product.template", [tplId], [
          "id",
          "name",
          "default_code",
          "list_price",
          "description_sale",
          "write_date",
          "active",
          "attribute_line_ids",
        ])
      )[0];

      if (!enTpl?.default_code) {
        results.push({ sku: `tpl-${tplId}`, en: "fail", ar: "fail", error: "no default_code" });
        continue;
      }

      // Fetch AR using context
      const arTpl = (await odooCall<Array<{ name: string; description_sale: string | false }>>({
        model: "product.template",
        method: "read",
        args: [[tplId], ["name", "description_sale"]],
        kwargs: { context: { lang: "ar_001" } },
      }))[0];

      const arMissing =
        !arTpl ||
        arTpl.name === enTpl.name || // not translated → Odoo falls back to EN
        !arTpl.name;

      // Upsert EN twin
      const enPayload = {
        ...transformProductTemplate(enTpl as never, []),
        lang: "en",
      };
      const enResult = await upsertVariableProduct(
        enTpl.default_code as string,
        enPayload,
        { eventId: `translation-en-${tplId}` },
      );

      // Upsert AR twin
      const arSku = `${enTpl.default_code as string}-ar`;
      const arPayload = {
        name: arMissing ? enTpl.name : arTpl.name,
        slug: `${(enPayload as never as { slug: string }).slug}-ar`,
        type: "variable" as const,
        sku: arSku,
        regular_price: String(enTpl.list_price),
        description: arMissing
          ? (enTpl.description_sale as string) || ""
          : (arTpl.description_sale as string) || "",
        status: enTpl.active ? ("publish" as const) : ("draft" as const),
        attributes: (enPayload as { attributes?: WCVariableProduct["attributes"] }).attributes ?? [],
        meta_data: [
          { key: "_odoo_template_id", value: tplId },
          { key: "_sync_source", value: "majestic-next-v2" },
          { key: "_lang", value: "ar" },
          ...(arMissing
            ? [
                { key: "_translation_pending", value: "true" },
                { key: "_translation_placeholder_from", value: "en" },
              ]
            : []),
        ],
      };

      const arResult = await upsertVariableProduct(arSku, arPayload, {
        eventId: `translation-ar-${tplId}`,
      });

      // Link Polylang twins
      try {
        await wcFetch({
          endpoint: "/majestic/v1/polylang/set-post-translations",
          method: "POST",
          body: { en: enResult.id, ar: arResult.id },
        });
      } catch (e) {
        console.warn(`[translation] Polylang link failed for ${enTpl.default_code}:`, e);
      }

      results.push({
        sku: enTpl.default_code as string,
        en: "ok",
        ar: arMissing ? "placeholder" : "ok",
      });
    } catch (e) {
      results.push({
        sku: `tpl-${tplId}`,
        en: "fail",
        ar: "fail",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json({ ok: true, results });
}
