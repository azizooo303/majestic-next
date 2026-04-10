/**
 * WordPress CMS — fetches all admin-managed site content from the Majestic REST API.
 * Endpoint: GET /wp-json/majestic/v1/settings
 *
 * Uses ISR cache tag 'site-content'. Call POST /api/revalidate (with secret header)
 * to purge the cache after saving changes in WordPress admin.
 */

import type { SiteContent } from '@/config/content-schema'
import { SITE_DEFAULTS } from '@/config/content-schema'

const WP_API = process.env.WP_API_URL ?? 'https://lightyellow-mallard-240169.hostingersite.com'

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${WP_API}/wp-json/majestic/v1/settings`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      console.warn(`[wp-settings] API returned ${res.status} — using defaults`)
      return SITE_DEFAULTS
    }
    const data = await res.json()
    return mapToSiteContent(data)
  } catch (err) {
    console.warn('[wp-settings] Fetch failed — using defaults', err)
    return SITE_DEFAULTS
  }
}

function mapToSiteContent(data: Record<string, unknown>): SiteContent {
  return {
    heroSlides:
      (data.heroSlides as SiteContent['heroSlides'])?.length
        ? (data.heroSlides as SiteContent['heroSlides'])
        : SITE_DEFAULTS.heroSlides,
    announcement:
      (data.announcement as SiteContent['announcement']) ?? SITE_DEFAULTS.announcement,
    contact:
      (data.contact as SiteContent['contact']) ?? SITE_DEFAULTS.contact,
    showrooms:
      (data.showrooms as SiteContent['showrooms'])?.length
        ? (data.showrooms as SiteContent['showrooms'])
        : SITE_DEFAULTS.showrooms,
    stats:
      (data.stats as SiteContent['stats'])?.length
        ? (data.stats as SiteContent['stats'])
        : SITE_DEFAULTS.stats,
    // WP doesn't manage these — keep from static defaults
    sections: SITE_DEFAULTS.sections,
    fontScale: SITE_DEFAULTS.fontScale,
  }
}
