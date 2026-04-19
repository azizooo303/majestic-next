/**
 * HMAC signature verification for Odoo → Next.js webhook payloads.
 *
 * Odoo's base.automation rule signs the raw JSON body with ODOO_SYNC_HMAC_SECRET.
 * Next.js verifies before processing to prevent spoofed sync events.
 */

import { createHmac, timingSafeEqual } from "crypto";

const HMAC_SECRET = process.env.ODOO_SYNC_HMAC_SECRET || "";

export function computeHmac(body: string): string {
  if (!HMAC_SECRET) {
    throw new Error("ODOO_SYNC_HMAC_SECRET not configured");
  }
  return createHmac("sha256", HMAC_SECRET).update(body).digest("hex");
}

export function verifyHmac(body: string, providedHmac: string): boolean {
  if (!HMAC_SECRET) {
    // In dev without HMAC configured, log warning but allow.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sync] ODOO_SYNC_HMAC_SECRET not set — skipping verification (dev mode)");
      return true;
    }
    return false;
  }
  if (!providedHmac) return false;
  try {
    const expected = computeHmac(body);
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(providedHmac, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
