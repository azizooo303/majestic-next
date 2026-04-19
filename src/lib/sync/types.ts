/**
 * Wave 2 Sync types — Odoo → WooCommerce mirror.
 *
 * Contract reference: projects/odoo/scratchpad/sync-contract-v1.md (Majestic-HQ)
 * Architecture: Next.js API routes replace n8n for cleaner, faster, version-controlled sync.
 */

// ── Odoo entities ──────────────────────────────────────────────────────────

export interface OdooProductTemplate {
  id: number;
  name: string;
  default_code: string | false;       // SKU (e.g. "DESK-CRATOS")
  list_price: number;
  categ_id: [number, string] | false;
  sale_ok: boolean;
  purchase_ok: boolean;
  active: boolean;
  type: string;
  uom_id: [number, string] | false;
  description_sale: string | false;
  description: string | false;
  // Translations via x_studio_ar fields or locale context
  attribute_line_ids: number[];
  write_date: string;
}

export interface OdooProductVariant {
  id: number;
  product_tmpl_id: [number, string];
  default_code: string | false;  // e.g. "DESK-CRATOS-EXEC-180-A398-BLK"
  lst_price: number;             // computed from template + extras
  qty_available: number;
  attribute_line_ids: number[];
  product_template_attribute_value_ids: number[];
  active: boolean;
}

export interface OdooAttributeValue {
  id: number;
  name: string;
  attribute_id: [number, string];
  extra_price: number;
}

export interface OdooStockQuant {
  id: number;
  product_id: [number, string];
  quantity: number;
  location_id: [number, string];
}

// ── WC entities (mirrors WC REST v3 shape) ─────────────────────────────────

export interface WCVariableProduct {
  id: number;
  name: string;
  slug: string;
  type: "variable";
  status: "publish" | "draft" | "private";
  sku: string;
  regular_price: string;
  description: string;
  short_description: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }>;
  meta_data: Array<{ key: string; value: unknown }>;
  variations: number[];
}

export interface WCVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number | null;
  attributes: Array<{ id: number; name: string; option: string }>;
  meta_data: Array<{ key: string; value: unknown }>;
}

// ── Sync event payload (Odoo → webhook) ────────────────────────────────────

export type SyncEventType =
  | "product.template.write"
  | "product.template.create"
  | "product.template.archive"
  | "product.product.write"
  | "stock.quant.write"
  | "product.pricelist.item.write";

export interface SyncEvent {
  event: SyncEventType;
  model: string;
  record_ids: number[];
  changed_fields?: string[];
  timestamp: string;              // ISO8601
  hmac: string;                   // HMAC-SHA256 of body
}

// ── Rollback payload ───────────────────────────────────────────────────────

export interface RollbackEntry {
  id: string;                     // UUID
  event_id: string;
  timestamp: string;
  operation: "create" | "update" | "delete";
  wc_entity_type: string;         // "product" | "variation" | "category" | etc.
  wc_entity_id?: number;
  before_state: unknown | null;   // snapshot before write
  after_state: unknown | null;    // what we tried to write
  status: "pending" | "success" | "failure" | "rolled_back";
  error?: string;
}

// ── Drift report ───────────────────────────────────────────────────────────

export interface DriftReport {
  run_at: string;
  total_odoo_entities: number;
  total_wc_entities: number;
  drift_count: number;
  drift_pct: number;
  kill_switch_triggered: boolean;
  by_class: {
    missing_in_wc: string[];
    orphan_in_wc: string[];
    price_mismatch: Array<{ sku: string; odoo: number; wc: number }>;
    stock_mismatch: Array<{ sku: string; odoo: number; wc: number }>;
    translation_missing_ar: string[];
  };
}

// ── Config ─────────────────────────────────────────────────────────────────

export const SYNC_CONFIG = {
  KILL_SWITCH_THRESHOLD_PCT: 5,
  PRICE_TOLERANCE_SAR: 0.01,
  STOCK_SYNC_WINDOW_HOURS: 1,
  DEFAULT_LOCALE: "en" as const,
  ALTERNATE_LOCALE: "ar" as const,
  WEBHOOK_TIMEOUT_MS: 15_000,
  BATCH_SIZE: 50,
} as const;
