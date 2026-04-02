/**
 * Admin authentication utilities.
 * Token is deterministic — derived from the ADMIN_PASSWORD env var.
 * No database, no sessions table. Works across all serverless invocations.
 */

import crypto from 'crypto'

export function createAdminToken(password: string): string {
  return crypto
    .createHmac('sha256', 'majestic-admin-2026')
    .update(password)
    .digest('hex')
}

export function isValidAdminToken(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const expected = createAdminToken(password)
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}
