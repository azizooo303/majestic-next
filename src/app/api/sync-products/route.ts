/**
 * GET /api/sync-products
 *
 * Triggers a WooCommerce → Supabase product sync.
 * Protected: requires Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
 *
 * Example (curl):
 *   curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
 *        https://your-site.vercel.app/api/sync-products
 *
 * Invoke from n8n or a Vercel cron job.
 */

import { NextRequest, NextResponse } from "next/server";
import { syncProducts } from "@/lib/sync-products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const expected = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncProducts();
    const res = NextResponse.json({ ok: true, ...result });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/sync-products]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
