-- Wave 2 sync tables — Odoo ↔ WooCommerce mirror
-- Applied by: supabase/run-migration.ts (or direct psql)

-- ── Rollback log ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_rollback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  operation VARCHAR NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
  wc_entity_type VARCHAR NOT NULL,
  wc_entity_id INTEGER,
  before_state JSONB,
  after_state JSONB,
  status VARCHAR NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failure', 'rolled_back')),
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_sync_rollback_status
  ON sync_rollback(status, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sync_rollback_event
  ON sync_rollback(event_id);
CREATE INDEX IF NOT EXISTS idx_sync_rollback_entity
  ON sync_rollback(wc_entity_type, wc_entity_id);

-- ── Kill switch ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_kill_switch (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  active BOOLEAN NOT NULL DEFAULT false,
  triggered_at TIMESTAMPTZ,
  triggered_by VARCHAR,
  reason TEXT,
  drift_pct REAL
);

INSERT INTO sync_kill_switch (id, active)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

-- ── Drift reports (nightly recon output) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_drift_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_odoo INTEGER NOT NULL,
  total_wc INTEGER NOT NULL,
  drift_count INTEGER NOT NULL,
  drift_pct REAL NOT NULL,
  kill_switch_triggered BOOLEAN NOT NULL DEFAULT false,
  by_class JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sync_drift_run_at
  ON sync_drift_reports(run_at DESC);

-- ── RLS — service role only ──────────────────────────────────────────────
ALTER TABLE sync_rollback ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_kill_switch ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_drift_reports ENABLE ROW LEVEL SECURITY;

-- No public policies — only accessed via supabaseAdmin (service role key).

COMMENT ON TABLE sync_rollback IS 'Per-write snapshot for Wave 2 Odoo→WC sync. Rolled back via admin UI.';
COMMENT ON TABLE sync_kill_switch IS 'Single-row gate. When active=true, all sync writes refuse.';
COMMENT ON TABLE sync_drift_reports IS 'Nightly reconciliation output. Historical drift trending.';
