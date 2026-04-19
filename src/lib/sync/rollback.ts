/**
 * Rollback log — per-write snapshot + DLQ.
 *
 * Every sync write is preceded by:
 * 1. Capture before_state from WC (current value)
 * 2. Write to Supabase rollback table with pending status
 * 3. Execute WC write
 * 4. Update status → success | failure
 *
 * On failure: entry stays for retry or manual rollback via admin UI.
 *
 * Supabase table required (run migration once):
 *
 *   CREATE TABLE sync_rollback (
 *     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     event_id VARCHAR NOT NULL,
 *     timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *     operation VARCHAR NOT NULL,
 *     wc_entity_type VARCHAR NOT NULL,
 *     wc_entity_id INTEGER,
 *     before_state JSONB,
 *     after_state JSONB,
 *     status VARCHAR NOT NULL DEFAULT 'pending',
 *     error TEXT
 *   );
 *   CREATE INDEX idx_sync_rollback_status ON sync_rollback(status, timestamp DESC);
 *   CREATE INDEX idx_sync_rollback_event ON sync_rollback(event_id);
 */

import { supabaseAdmin } from "../supabase";
import type { RollbackEntry } from "./types";

export async function captureRollback(
  entry: Omit<RollbackEntry, "id" | "timestamp">,
): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("sync_rollback")
    .insert({
      event_id: entry.event_id,
      operation: entry.operation,
      wc_entity_type: entry.wc_entity_type,
      wc_entity_id: entry.wc_entity_id,
      before_state: entry.before_state,
      after_state: entry.after_state,
      status: entry.status,
      error: entry.error,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[sync] captureRollback error:", error);
    // Don't throw — sync continues but rollback is degraded.
    return "";
  }
  return data.id as string;
}

export async function updateRollbackStatus(
  id: string,
  status: RollbackEntry["status"],
  error?: string,
): Promise<void> {
  if (!id) return;
  await supabaseAdmin
    .from("sync_rollback")
    .update({ status, error })
    .eq("id", id);
}

export async function getPendingRollbacks(limit = 100): Promise<RollbackEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("sync_rollback")
    .select("*")
    .eq("status", "pending")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[sync] getPendingRollbacks error:", error);
    return [];
  }
  return (data as RollbackEntry[]) || [];
}
