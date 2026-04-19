/**
 * POST /api/sync/odoo-webhook
 *
 * Real-time sync: Odoo pushes entity changes here.
 *
 * Odoo side: base.automation rule on product.template, product.product, stock.quant writes
 * fires an HTTP POST to this endpoint with the record IDs + HMAC signature.
 *
 * Flow:
 *   1. Verify HMAC
 *   2. Parse SyncEvent
 *   3. Check kill-switch — abort if active
 *   4. Branch on event type → pull fresh data from Odoo → transform → write to WC
 *   5. Return 200 quickly (async processing for heavy events)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyHmac } from "@/lib/sync/hmac";
import { searchRead, read } from "@/lib/sync/odoo-client";
import { transformProductTemplate } from "@/lib/sync/transform";
import { upsertVariableProduct, archiveVariableProduct } from "@/lib/sync/wc-writer";
import { isKillSwitchActive } from "@/lib/sync/kill-switch";
import type { SyncEvent, OdooProductTemplate } from "@/lib/sync/types";

export const runtime = "nodejs";           // needs crypto + fetch XML-RPC
export const dynamic = "force-dynamic";     // no caching

// Infer event type from Odoo native webhook payload (when URL ?event= not set)
function inferEventType(payload: Record<string, unknown>): string {
  const model = (payload._model as string) || "";
  if (model === "product.template") {
    return payload.active === false ? "product.template.archive" : "product.template.write";
  }
  if (model === "product.product") return "product.product.write";
  if (model === "stock.quant") return "stock.quant.write";
  return "product.template.write";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-odoo-signature") || "";
  const { searchParams } = new URL(req.url);
  const urlToken = searchParams.get("token");

  // Auth: either HMAC-signed body OR URL token matching INTERNAL_SYNC_TOKEN
  // (Odoo native webhook action doesn't support HMAC; it uses URL tokens instead.)
  const internalToken = process.env.INTERNAL_SYNC_TOKEN;
  const tokenValid = !!(internalToken && urlToken && urlToken === internalToken);
  const hmacValid = !!signature && verifyHmac(rawBody, signature);

  if (!tokenValid && !hmacValid) {
    return NextResponse.json({ error: "unauthorized (need X-Odoo-Signature OR ?token=)" }, { status: 401 });
  }

  if (await isKillSwitchActive()) {
    return NextResponse.json(
      { error: "kill-switch active — sync halted" },
      { status: 503 },
    );
  }

  // Parse body — support BOTH custom SyncEvent format AND Odoo native webhook format
  let event: SyncEvent;
  try {
    const parsed = JSON.parse(rawBody);

    if (parsed.event && Array.isArray(parsed.record_ids)) {
      // Custom format (future-proofing — e.g. curl-triggered)
      event = parsed as SyncEvent;
    } else {
      // Odoo native webhook format:
      //   {"_model": "product.template", "id": 85, "name": "Cratos", ...}
      //   OR for batch: {"_model": "product.template", "_records": [{id: 85}, ...]}
      const eventType = (searchParams.get("event") || inferEventType(parsed)) as SyncEvent["event"];
      const recordIds = Array.isArray(parsed._records)
        ? parsed._records.map((r: { id: number }) => r.id)
        : parsed.id
          ? [parsed.id]
          : [];

      event = {
        event: eventType,
        model: parsed._model || eventType.split(".").slice(0, -1).join("."),
        record_ids: recordIds,
        timestamp: new Date().toISOString(),
        hmac: "",
      };
    }
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (!event.record_ids.length) {
    return NextResponse.json({ error: "no record_ids in payload" }, { status: 400 });
  }

  const eventId = `${event.event}-${event.timestamp}-${event.record_ids.join(",")}`;

  try {
    switch (event.event) {
      case "product.template.create":
      case "product.template.write":
        await handleTemplateChange(event.record_ids, eventId);
        break;

      case "product.template.archive":
        await handleTemplateArchive(event.record_ids, eventId);
        break;

      case "product.product.write":
        // Variation update — fetch fresh and patch the variable product attributes
        await handleVariantChange(event.record_ids, eventId);
        break;

      case "stock.quant.write":
        await handleStockChange(event.record_ids, eventId);
        break;

      case "product.pricelist.item.write":
        // Pricelist changes: deferred to Wave 2.5
        console.log("[sync] pricelist.item.write deferred to Wave 2.5");
        break;

      default:
        return NextResponse.json(
          { error: `unknown event: ${event.event}` },
          { status: 400 },
        );
    }

    return NextResponse.json({ ok: true, event_id: eventId });
  } catch (e) {
    console.error("[sync] webhook failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "sync failed", event_id: eventId },
      { status: 500 },
    );
  }
}

async function handleTemplateChange(ids: number[], eventId: string) {
  const templates = await read<OdooProductTemplate>("product.template", ids, [
    "id",
    "name",
    "default_code",
    "list_price",
    "categ_id",
    "sale_ok",
    "purchase_ok",
    "active",
    "type",
    "uom_id",
    "description_sale",
    "description",
    "attribute_line_ids",
    "write_date",
  ]);

  for (const tpl of templates) {
    if (!tpl.default_code) {
      console.warn(`[sync] template ${tpl.id} has no default_code — skipping`);
      continue;
    }

    // Fetch attribute lines for this template
    const lines = await searchRead<{
      id: number;
      attribute_id: [number, string];
      value_ids: number[];
    }>(
      "product.template.attribute.line",
      [["product_tmpl_id", "=", tpl.id]],
      ["id", "attribute_id", "value_ids"],
    );

    // Fetch create_variant from parent product.attribute to know which axes are variants
    const attrIds = Array.from(new Set(lines.map((l) => l.attribute_id[0])));
    const attrs = attrIds.length
      ? await read<{ id: number; create_variant: string }>(
          "product.attribute",
          attrIds,
          ["id", "create_variant"],
        )
      : [];
    const attrCreateVariant = new Map(attrs.map((a) => [a.id, a.create_variant]));

    const attrLines: Array<{
      attribute_name: string;
      value_names: string[];
      variation: boolean;
    }> = [];

    for (const line of lines) {
      if (!line.value_ids?.length) continue;
      const values = await read<{ name: string }>(
        "product.attribute.value",
        line.value_ids,
        ["name"],
      );
      const cv = attrCreateVariant.get(line.attribute_id[0]) || "always";
      attrLines.push({
        attribute_name: line.attribute_id[1],
        value_names: values.map((v) => v.name),
        // Configurator-only attributes have create_variant='no_variant'
        variation: cv !== "no_variant",
      });
    }

    const wcPayload = transformProductTemplate(tpl, attrLines);
    await upsertVariableProduct(tpl.default_code as string, wcPayload, { eventId });
    console.log(`[sync] template ${tpl.default_code} → WC upserted`);
  }
}

async function handleTemplateArchive(ids: number[], eventId: string) {
  // Fetch SKUs → find WC ids → archive (set to draft, never delete)
  const templates = await read<{ default_code: string | false }>(
    "product.template",
    ids,
    ["default_code"],
  );
  // Look up WC products by SKU
  const { wcFetch } = await import("@/lib/woocommerce");
  for (const tpl of templates) {
    if (!tpl.default_code) continue;
    const wcProducts = await wcFetch<Array<{ id: number }>>({
      endpoint: "/wc/v3/products",
      params: { sku: tpl.default_code as string, per_page: 1 },
    });
    if (wcProducts[0]) {
      await archiveVariableProduct(wcProducts[0].id, { eventId });
      console.log(`[sync] template ${tpl.default_code} archived in WC`);
    }
  }
}

async function handleVariantChange(ids: number[], eventId: string) {
  // When a variant changes, we re-sync the parent template (variations are auto-managed by WC from attributes)
  const variants = await read<{ product_tmpl_id: [number, string] }>(
    "product.product",
    ids,
    ["product_tmpl_id"],
  );
  const tplIds = Array.from(
    new Set(variants.filter((v) => v.product_tmpl_id).map((v) => v.product_tmpl_id[0])),
  );
  if (tplIds.length) {
    await handleTemplateChange(tplIds, eventId);
  }
}

async function handleStockChange(quantIds: number[], eventId: string) {
  // Fetch quants → find affected templates → sum stock → push to WC
  const quants = await read<{
    product_id: [number, string];
    quantity: number;
    location_id: [number, string];
  }>("stock.quant", quantIds, ["product_id", "quantity", "location_id"]);

  const affectedProductIds = Array.from(
    new Set(quants.filter((q) => q.product_id).map((q) => q.product_id[0])),
  );
  if (!affectedProductIds.length) return;

  const variants = await read<{
    product_tmpl_id: [number, string];
    qty_available: number;
    default_code: string | false;
  }>("product.product", affectedProductIds, [
    "product_tmpl_id",
    "qty_available",
    "default_code",
  ]);

  const tplToTotal: Record<number, { name: string; sku?: string; qty: number }> = {};
  for (const v of variants) {
    if (!v.product_tmpl_id) continue;
    const [tplId, tplName] = v.product_tmpl_id;
    tplToTotal[tplId] ||= { name: tplName, qty: 0 };
    tplToTotal[tplId].qty += v.qty_available || 0;
  }

  const { wcFetch } = await import("@/lib/woocommerce");
  const { updateStockOnProduct } = await import("@/lib/sync/wc-writer");

  for (const [tplId, info] of Object.entries(tplToTotal)) {
    // Get template SKU
    const tpl = await read<{ default_code: string | false }>(
      "product.template",
      [parseInt(tplId, 10)],
      ["default_code"],
    );
    const sku = tpl[0]?.default_code;
    if (!sku) continue;

    const wcProducts = await wcFetch<Array<{ id: number }>>({
      endpoint: "/wc/v3/products",
      params: { sku: sku as string, per_page: 1 },
    });
    if (wcProducts[0]) {
      await updateStockOnProduct(wcProducts[0].id, info.qty, { eventId });
      console.log(`[sync] stock ${sku} → ${info.qty} units synced to WC`);
    }
  }
}
