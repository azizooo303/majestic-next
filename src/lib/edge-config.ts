/**
 * Edge Config wrapper — reads from Vercel Edge Config with site.ts fallback.
 * If EDGE_CONFIG env var is not set, always returns the fallback value.
 */

import type { SiteContent } from '@/config/content-schema'
import { createClient } from '@vercel/edge-config'

type EdgeConfigClient = ReturnType<typeof createClient>
let edgeConfig: EdgeConfigClient | null = null

function getClient(): EdgeConfigClient | null {
  if (!process.env.EDGE_CONFIG) return null
  if (!edgeConfig) {
    edgeConfig = createClient(process.env.EDGE_CONFIG)
  }
  return edgeConfig
}

/**
 * Get a value from Edge Config, falling back to the provided default.
 */
export async function getConfigValue<T>(key: string, fallback: T): Promise<T> {
  try {
    const client = getClient()
    if (!client) return fallback
    const value = await client.get<T>(key)
    return value ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Get all admin-managed content, merging Edge Config overrides with site.ts defaults.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const { SITE_DEFAULTS } = await import('@/config/content-schema')

  try {
    const client = getClient()
    if (!client) return SITE_DEFAULTS

    const overrides = await client.get<Partial<SiteContent>>('siteContent')
    if (!overrides) return SITE_DEFAULTS

    return deepMerge(SITE_DEFAULTS as unknown as Record<string, unknown>, overrides as unknown as Record<string, unknown>) as unknown as SiteContent
  } catch {
    return SITE_DEFAULTS
  }
}

/**
 * Write content to Edge Config via Vercel REST API.
 * Called from admin API routes (server-side only).
 */
export async function setSiteContent(content: Partial<SiteContent>): Promise<void> {
  const token = process.env.VERCEL_API_TOKEN
  const configId = process.env.EDGE_CONFIG_ID

  if (!token || !configId) {
    // Graceful no-op if not configured — changes still save to backup JSON
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
