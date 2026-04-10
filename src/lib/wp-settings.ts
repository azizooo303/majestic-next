/**
 * Site content source.
 *
 * Previously fetched from a WordPress headless CMS experiment; that approach
 * was reverted. This stub returns hardcoded SITE_DEFAULTS so layout.tsx and
 * page.tsx — which still import `getSiteContent` — keep working unchanged.
 */

import type { SiteContent } from '@/config/content-schema'
import { SITE_DEFAULTS } from '@/config/content-schema'

export async function getSiteContent(): Promise<SiteContent> {
  return SITE_DEFAULTS
}
