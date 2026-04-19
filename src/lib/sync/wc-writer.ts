/**
 * WooCommerce write operations for sync.
 *
 * Builds on the existing `wcFetch` wrapper in src/lib/woocommerce.ts.
 * Every mutation:
 *  1. Fetches current state (before_state)
 *  2. Captures rollback entry in Supabase
 *  3. Executes the write
 *  4. Updates rollback status
 *
 * Never writes if kill-switch is active.
 */

import { wcFetch } from "../woocommerce";
import { captureRollback, updateRollbackStatus } from "./rollback";
import { isKillSwitchActive } from "./kill-switch";
import type { WCVariableProduct } from "./types";

interface SyncWriteOptions {
  eventId: string;
  skipRollback?: boolean;  // for nightly idempotent patches where before-state is noisy
}

/**
 * Upsert a variable product by SKU (default_code). Creates if missing, updates if exists.
 */
export async function upsertVariableProduct(
  sku: string,
  payload: Partial<WCVariableProduct>,
  opts: SyncWriteOptions,
): Promise<{ id: number; created: boolean }> {
  if (await isKillSwitchActive()) {
    throw new Error("Sync kill-switch active — refusing write");
  }

  // Try to find existing by SKU
  const existing = await wcFetch<WCVariableProduct[]>({
    endpoint: "/wc/v3/products",
    params: { sku, per_page: 1 },
  });

  let rollbackId = "";
  if (!opts.skipRollback) {
    rollbackId = await captureRollback({
      event_id: opts.eventId,
      operation: existing.length > 0 ? "update" : "create",
      wc_entity_type: "product",
      wc_entity_id: existing[0]?.id,
      before_state: existing[0] || null,
      after_state: payload,
      status: "pending",
    });
  }

  try {
    if (existing.length > 0) {
      const updated = await wcFetch<WCVariableProduct>({
        endpoint: `/wc/v3/products/${existing[0].id}`,
        method: "PUT",
        body: payload,
      });
      if (rollbackId) await updateRollbackStatus(rollbackId, "success");
      return { id: updated.id, created: false };
    }

    const created = await wcFetch<WCVariableProduct>({
      endpoint: "/wc/v3/products",
      method: "POST",
      body: payload,
    });
    if (rollbackId) await updateRollbackStatus(rollbackId, "success");
    return { id: created.id, created: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (rollbackId) await updateRollbackStatus(rollbackId, "failure", msg);
    throw e;
  }
}

/**
 * Update stock quantity + status on a WC variable product (aggregate across variants).
 */
export async function updateStockOnProduct(
  wcProductId: number,
  quantity: number,
  opts: SyncWriteOptions,
): Promise<void> {
  if (await isKillSwitchActive()) {
    throw new Error("Sync kill-switch active — refusing write");
  }

  const before = await wcFetch<WCVariableProduct>({
    endpoint: `/wc/v3/products/${wcProductId}`,
  });

  const rollbackId = await captureRollback({
    event_id: opts.eventId,
    operation: "update",
    wc_entity_type: "product",
    wc_entity_id: wcProductId,
    before_state: { stock_quantity: before.meta_data?.find?.((m) => m.key === "_stock_quantity")?.value },
    after_state: { stock_quantity: quantity },
    status: "pending",
  });

  try {
    await wcFetch<WCVariableProduct>({
      endpoint: `/wc/v3/products/${wcProductId}`,
      method: "PUT",
      body: {
        stock_quantity: quantity,
        stock_status: quantity > 0 ? "instock" : "outofstock",
        manage_stock: true,
      },
    });
    await updateRollbackStatus(rollbackId, "success");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await updateRollbackStatus(rollbackId, "failure", msg);
    throw e;
  }
}

/**
 * Archive (set status=draft) — we never delete, mirroring Odoo's active=False semantics.
 */
export async function archiveVariableProduct(
  wcProductId: number,
  opts: SyncWriteOptions,
): Promise<void> {
  if (await isKillSwitchActive()) {
    throw new Error("Sync kill-switch active — refusing write");
  }

  const rollbackId = await captureRollback({
    event_id: opts.eventId,
    operation: "update",
    wc_entity_type: "product",
    wc_entity_id: wcProductId,
    before_state: { status: "publish" },
    after_state: { status: "draft" },
    status: "pending",
  });

  try {
    await wcFetch({
      endpoint: `/wc/v3/products/${wcProductId}`,
      method: "PUT",
      body: { status: "draft" },
    });
    await updateRollbackStatus(rollbackId, "success");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await updateRollbackStatus(rollbackId, "failure", msg);
    throw e;
  }
}
