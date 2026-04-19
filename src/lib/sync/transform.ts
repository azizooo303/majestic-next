/**
 * Odoo → WooCommerce field transforms.
 *
 * Each function takes an Odoo record shape and returns a WC payload ready for REST PUT/POST.
 *
 * Contract reference: projects/odoo/scratchpad/sync-contract-v1.md §1 Entity Map (Majestic-HQ repo)
 *
 * Rule: Odoo wins on every field. Never transform in reverse direction.
 */

import type { OdooProductTemplate, WCVariableProduct } from "./types";

// Slugify for WC URL slugs
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Transform Odoo product.template → WC variable product payload.
 *
 * Usage:
 *   const wcPayload = transformProductTemplate(odooTpl, odooAttributes);
 *   await wcFetch({ endpoint: `/wc/v3/products/${wcId}`, method: "PUT", body: wcPayload });
 */
export function transformProductTemplate(
  odoo: OdooProductTemplate,
  attributeLines: Array<{
    attribute_name: string;
    value_names: string[];
    variation: boolean;
  }>,
): Partial<WCVariableProduct> {
  const wcAttrs = attributeLines.map((line, i) => ({
    id: 0, // WC will assign on create; match by name on update
    name: line.attribute_name,
    position: i,
    visible: true,
    variation: line.variation,
    options: line.value_names,
  }));

  return {
    name: odoo.name,
    slug: slugify(odoo.default_code || odoo.name),
    type: "variable" as const,
    sku: (odoo.default_code as string) || "",
    regular_price: String(odoo.list_price),
    description: (odoo.description_sale as string) || (odoo.description as string) || "",
    short_description: "",
    status: odoo.active ? "publish" : "draft",
    attributes: wcAttrs,
    meta_data: [
      { key: "_odoo_template_id", value: odoo.id },
      { key: "_odoo_write_date", value: odoo.write_date },
      { key: "_sync_source", value: "majestic-next-v2" },
    ],
  };
}

/**
 * Transform Odoo variant attribute selection → WC variation attributes array.
 */
export function transformVariantAttributes(
  odooAttributeValues: Array<{ attribute_name: string; value_name: string }>,
): Array<{ id: number; name: string; option: string }> {
  return odooAttributeValues.map((v) => ({
    id: 0,
    name: v.attribute_name,
    option: v.value_name,
  }));
}

/**
 * Compute stock_quantity by summing stock.quant across internal locations.
 */
export function aggregateStock(
  quants: Array<{ quantity: number; location_usage: string }>,
): number {
  return quants
    .filter((q) => q.location_usage === "internal")
    .reduce((sum, q) => sum + q.quantity, 0);
}

/**
 * Variant SKU parser for the locked universal format:
 * {TYPE}-{FAMILY}-{CONFIG}-{SIZE}-{FINISH}-{LEG}
 *
 * Returns structured parts or null if format doesn't match.
 */
export function parseVariantSku(sku: string): {
  type: string;
  family: string;
  config: string;
  size: string;
  finish: string;
  leg: string;
} | null {
  const parts = sku.split("-");
  if (parts.length < 6) return null;
  const [type, family, config, size, finish, ...legParts] = parts;
  return {
    type,
    family,
    config,
    size,
    finish,
    leg: legParts.join("-"),
  };
}

/**
 * Build template SKU (parent) from variant SKU.
 */
export function getTemplateSku(variantSku: string): string | null {
  const parts = parseVariantSku(variantSku);
  if (!parts) return null;
  return `${parts.type}-${parts.family}-${parts.config}`;
}
