/**
 * Kill-switch — halts sync writes when drift exceeds threshold.
 *
 * Stored in Supabase (or Edge Config) so all sync routes see the same state.
 * Reset via admin UI or manual SQL.
 *
 * Required Supabase table:
 *
 *   CREATE TABLE sync_kill_switch (
 *     id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
 *     active BOOLEAN NOT NULL DEFAULT false,
 *     triggered_at TIMESTAMPTZ,
 *     triggered_by VARCHAR,
 *     reason TEXT,
 *     drift_pct REAL
 *   );
 *   INSERT INTO sync_kill_switch (id, active) VALUES (1, false);
 */

import { supabaseAdmin } from "../supabase";
import { SYNC_CONFIG } from "./types";

export async function isKillSwitchActive(): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("sync_kill_switch")
    .select("active")
    .eq("id", 1)
    .single();
  return !!data?.active;
}

export async function activateKillSwitch(
  triggeredBy: string,
  reason: string,
  driftPct?: number,
): Promise<void> {
  await supabaseAdmin.from("sync_kill_switch").upsert({
    id: 1,
    active: true,
    triggered_at: new Date().toISOString(),
    triggered_by: triggeredBy,
    reason,
    drift_pct: driftPct,
  });

  console.error(
    `[sync] KILL-SWITCH ACTIVATED by ${triggeredBy}: ${reason} (drift: ${driftPct ?? "n/a"}%)`,
  );
}

export async function resetKillSwitch(resetBy: string): Promise<void> {
  await supabaseAdmin.from("sync_kill_switch").upsert({
    id: 1,
    active: false,
    triggered_at: null,
    triggered_by: resetBy,
    reason: "manual reset",
    drift_pct: null,
  });
  console.log(`[sync] kill-switch reset by ${resetBy}`);
}

export function shouldTriggerKillSwitch(driftPct: number): boolean {
  return driftPct > SYNC_CONFIG.KILL_SWITCH_THRESHOLD_PCT;
}
