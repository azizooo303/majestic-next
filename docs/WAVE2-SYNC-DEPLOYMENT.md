# Wave 2 Sync — Deployment Runbook

**Status:** Code landed on main, needs env + Odoo webhook + Supabase migration
**Owner:** Aziz + devops
**Last updated:** 2026-04-20

---

## Architecture

```
Odoo (majestic-furniture4.odoo.com)
  │
  │  base.automation rule → HTTP POST with HMAC signature
  │
  ▼
Next.js API route: /api/sync/odoo-webhook
  │  Verifies HMAC, parses event, pulls fresh data via XML-RPC
  │
  ▼
Odoo XML-RPC → transform → WC REST API PUT/POST
  │
  ▼
WooCommerce (lightyellow-mallard-...hostingersite.com)
```

Plus:
- **Vercel Cron** at 23:00 UTC daily (= 02:00 Asia/Riyadh) triggers `/api/sync/nightly-reconcile`
- **Translation sync** runs inside webhook flow (both EN + AR Polylang twins always created)
- **Kill-switch** halts writes when nightly drift > 5%
- **Rollback log** captures before/after for every write in Supabase

---

## Step 1 — Database migration (one-time, ~2 min)

```bash
cd C:/Users/Admin/Desktop/Majestic-Next
npx tsx supabase/run-migration.ts supabase/migrations/20260420_sync_wave2.sql
```

Or apply via Supabase SQL Editor: paste the contents of `supabase/migrations/20260420_sync_wave2.sql`.

Creates 3 tables: `sync_rollback`, `sync_kill_switch`, `sync_drift_reports`.

---

## Step 2 — Environment variables in Vercel (~5 min)

Dashboard → Project → Settings → Environment Variables. Add for all environments:

| Variable | Value | How to get |
|---|---|---|
| `ODOO_URL` | `https://majestic-furniture4.odoo.com` | Known |
| `ODOO_DB` | `majestic-furniture4` | Known |
| `ODOO_UID` | `2` | Known (admin user ID) |
| `ODOO_KEY` | (API key) | Odoo → My Profile → Account Security → New API Key |
| `ODOO_SYNC_HMAC_SECRET` | 64-char hex | `node -e "require('crypto').randomBytes(32).toString('hex')"` |
| `CRON_SECRET` | random string | Any long random string; used by Vercel Cron auth |
| `INTERNAL_SYNC_TOKEN` | random string | For internal webhook → translation-sync calls |

**IMPORTANT:** Set exact same `ODOO_SYNC_HMAC_SECRET` in the Odoo side too (Step 4).

After adding env vars, redeploy:
```bash
git commit --allow-empty -m "chore: redeploy for sync env"
git push
```

---

## Step 3 — Verify Vercel Cron registered

After deploy, check Vercel Dashboard → Crons tab. Should show:

```
/api/sync/nightly-reconcile — 0 23 * * * (daily 23:00 UTC = 02:00 Asia/Riyadh)
```

Force-run once manually to verify:
```bash
curl -H "Authorization: Bearer <CRON_SECRET>" \
  https://majestic-next.vercel.app/api/sync/nightly-reconcile
```

Expected response: `{"ok": true, "drift_count": 0, ...}` (or first run shows missing WC products, will auto-create).

---

## Step 4 — Odoo base.automation rules (~10 min)

In Odoo UI: **Settings → Technical → Automation → Automated Actions**

### Rule 1 — product.template writes

```
Name:       Sync product.template to Next.js
Model:      product.template
Trigger:    On Save (after record write)
Action:     Execute Python Code
Python Code: (paste below)
```

```python
import hmac, hashlib, json, urllib.request

ENDPOINT = "https://majestic-next.vercel.app/api/sync/odoo-webhook"
SECRET   = "PASTE_ODOO_SYNC_HMAC_SECRET_HERE"

for rec in records:
    payload = {
        "event": "product.template.write",
        "model": "product.template",
        "record_ids": [rec.id],
        "changed_fields": list(rec._fields.keys()),  # pragmatic; refine if noisy
        "timestamp": rec.write_date.isoformat(),
        "hmac": "",  # signed after serialization below
    }
    body = json.dumps(payload, separators=(',', ':'), sort_keys=True)
    sig = hmac.new(SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()
    req = urllib.request.Request(
        ENDPOINT,
        data=body.encode(),
        headers={
            "Content-Type": "application/json",
            "X-Odoo-Signature": sig,
        },
    )
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        _logger.warning(f"sync-webhook failed for {rec.id}: {e}")
```

### Rule 2 — product.product variant writes

Same pattern, model=`product.product`, event=`product.product.write`.

### Rule 3 — stock.quant writes

Same pattern, model=`stock.quant`, event=`stock.quant.write`.

### Rule 4 — product.template archive (active → False)

```
Name:    Sync product.template archive to Next.js
Model:   product.template
Trigger: On Update of field (active)
Filter:  active == False
```

Event name: `product.template.archive`.

---

## Step 5 — Deploy Polylang snippet (~2 min)

WP Admin → Code Snippets → Add New.

Paste contents of `C:/Users/Admin/Desktop/Majestic-HQ/projects/odoo/scratchpad/n8n-workflows/polylang-set-post-translations.php`.

Activate. This exposes `POST /wp-json/majestic/v1/polylang/set-post-translations` which the translation-sync route uses to link EN+AR twins.

(Note: the PHP snippet was written for the n8n path, but the endpoint it creates is the same — Next.js calls the same WP snippet.)

---

## Step 6 — Dry-run test (~5 min)

Change the price of DESK-CRATOS in Odoo by 1 SAR:

```python
# In Odoo web → Inventory → Products → Cratos Desk → edit Sales Price → save
```

Within 5 seconds, check:
- Vercel function logs: `/api/sync/odoo-webhook` should show success
- Supabase: `sync_rollback` table should have a new row with operation="update", status="success"
- WC: Product DESK-CRATOS regular_price should match Odoo

If drift: check Vercel logs + Supabase `sync_rollback.error` column.

---

## Step 7 — Full catalog sync (~15 min)

Once Dry-run passes, trigger full recon:

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" \
  https://majestic-next.vercel.app/api/sync/nightly-reconcile
```

Expected: creates 16 WC variable products (missing_in_wc count → 0 after run).

Verify in WC admin: https://lightyellow-mallard-240169.hostingersite.com/wp-admin/edit.php?post_type=product → filter by type=variable → should show 16 DESK-* products.

---

## Step 8 — Monitor

After go-live:
- Daily: check `sync_drift_reports` in Supabase — drift should stay <1% steady-state
- Weekly: review `sync_rollback` for any failure patterns
- On alert: Vercel logs → Sentry traces for detailed debugging

---

## Kill-switch handling

If nightly drift > 5%:
1. Kill-switch auto-activates (Supabase `sync_kill_switch.active = true`)
2. All write routes return 503
3. Vercel function logs show the drift percentage

To reset after investigating:
```sql
UPDATE sync_kill_switch SET active = false, reason = 'manual reset after fix' WHERE id = 1;
```

Or call a future admin route (not built yet): `POST /api/admin/sync/reset-kill-switch` with admin auth.

---

## Rollback a bad sync

Every write logs to `sync_rollback`. To manually revert a bad push:

```sql
SELECT id, wc_entity_id, before_state FROM sync_rollback
WHERE status = 'success' AND timestamp > '2026-04-20 10:00:00'
ORDER BY timestamp DESC;
```

Take the `before_state` for the affected rows and PUT back to WC manually.

(Future: add `/api/admin/sync/rollback/:id` route to automate.)

---

## Comparison vs n8n (why we moved)

| | n8n cloud path | Next.js API path (this) |
|---|---|---|
| Deployment | Import 3 JSONs + credentials + base.automation URLs | Single Vercel deploy + env vars + base.automation URLs |
| Version control | JSON files in scratchpad | Full git history, TypeScript types |
| Debugging | n8n execution viewer | Vercel logs + Sentry + type checker |
| Cost | n8n cloud executions + subscription | Vercel functions (pay per execution, generous free tier) |
| Audit trail | n8n Execution History (cloud-only) | Supabase sync_rollback + Vercel logs + Sentry |
| Rollback | Manual via n8n + WC UI | Structured per-write rollback log in Supabase |
| Latency | Odoo → n8n → WC (2 hops) | Odoo → Next.js (1 hop) |
| Kill-switch | Per-workflow n8n static data | Shared Supabase row (all routes respect) |

The n8n workflows built earlier are archived at `projects/odoo/scratchpad/n8n-workflows/` (Majestic-HQ) — kept for reference + fallback if Next.js path has issues.

---

## Scope deferred to Wave 2.5

The initial sync-architect contract covered 8 Odoo entities; this implementation wires 5:

✅ Implemented:
- product.template → WC variable product (full field mapping)
- product.product variants (via template re-sync + auto-variation)
- stock.quant aggregate → WC stock_quantity
- Polylang EN + AR twin maintenance
- Archive/active flag sync

⏳ Deferred to Wave 2.5:
- product.category → WC product_cat (still using basic categorization)
- product.pricelist → WC regular_price/sale_price (using list_price only)
- product.template.attribute.exclusion → WC availability rules (client-side for now)
- product.image → WC images[] multi-image gallery
- Materialise-variant JIT bridge for dynamic variants (Wave 3 cart dependency)

These don't block Wave 3 launch. Aziz can decide priority after Wave 3 is live.
