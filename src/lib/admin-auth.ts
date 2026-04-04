/**
 * Admin authentication utilities.
 * Token is deterministic — derived from the ADMIN_PASSWORD env var.
 * No database, no sessions table. Works across all serverless invocations.
 */

import crypto from 'crypto'

export function createAdminToken(password: string): string {
  const secret = process.env.ADMIN_HMAC_SECRET
  if (!secret) throw new Error('ADMIN_HMAC_SECRET env var is not set')
  return crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex')
}

export function isValidAdminToken(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const expected = createAdminToken(password)
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}
