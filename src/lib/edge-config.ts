/**
 * Edge Config wrapper — reads from Vercel Edge Config with site.ts fallback.
 * Uses the Edge Config REST API directly (no SDK) to avoid Turbopack bundling issues.
 * If EDGE_CONFIG env var is not set, always returns the fallback value.
 *
 * EDGE_CONFIG format: https://edge-config.vercel.com/{id}?token={token}
 */

import type { SiteContent } from '@/config/content-schema'

function parseConnectionString(): { id: string; token: string } | null {
  const conn = process.env.EDGE_CONFIG
  if (!conn) return null
  try {
    const url = new URL(conn)
    const id = url.pathname.replace(/^\//, '')
    const token = url.searchParams.get('token')
    if (!id || !token) return null
    return { id, token }
  } catch {
    return null
  }
}

async function fetchItem<T>(key: string): Promise<T | undefined> {
  const parsed = parseConnectionString()
  if (!parsed) return undefined
  try {
    const res = await fetch(
      `https://edge-config.vercel.com/${parsed.id}/item/${key}?token=${parsed.token}`,
      { next: { revalidate: 0 } }
    )
    if (!res.ok) return undefined
    return res.json() as Promise<T>
  } catch {
    return undefined
  }
}

/**
 * Get a value from Edge Config, falling back to the provided default.
 */
export async function getConfigValue<T>(key: string, fallback: T): Promise<T> {
  const value = await fetchItem<T>(key)
  return value ?? fallback
}

/**
 * Get all admin-managed content, merging Edge Config overrides with site.ts defaults.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const { SITE_DEFAULTS } = await import('@/config/content-schema')

  const overrides = await fetchItem<Partial<SiteContent>>('siteContent')
  if (!overrides) return SITE_DEFAULTS

  return deepMerge(
    SITE_DEFAULTS as unknown as Record<string, unknown>,
    overrides as unknown as Record<string, unknown>
  ) as unknown as SiteContent
}

/**
 * Write content to Edge Config via Vercel REST API.
 * Called from admin API routes (server-side only).
 */
export async function setSiteContent(content: Partial<SiteContent>): Promise<void> {
  const token = process.env.VERCEL_API_TOKEN
  const configId = process.env.EDGE_CONFIG_ID

  if (!token || !configId) {
    console.warn('[edge-config] VERCEL_API_TOKEN or EDGE_CONFIG_ID not set — skipping Edge Config write')
    return
  }

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${configId}/items`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ operation: 'upsert', key: 'siteContent', value: content }],
      }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Edge Config write failed: ${res.status} ${text}`)
  }
}

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    if (
      override[key] !== null &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key]) &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        override[key] as Record<string, unknown>
      )
    } else {
      result[key] = override[key]
    }
  }
  return result
}
