import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isValidAdminToken } from '@/lib/admin-auth'
import { setSiteContent } from '@/lib/edge-config'
import type { SiteContent } from '@/config/content-schema'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  // Verify admin session
  const cookie = request.cookies.get('majestic_admin')
  if (!cookie || !isValidAdminToken(cookie.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const content: Partial<SiteContent> = await request.json()

  // Layer 1 — write to Edge Config (instant live update)
  try {
    await setSiteContent(content)
  } catch (err) {
    console.error('[admin/save] Edge Config write failed:', err)
    // Don't abort — still write backup
  }

  // Layer 2 — write backup JSON to repo (git source of truth)
  try {
    const backupPath = path.join(process.cwd(), 'src/config/content-backup.json')
    await writeFile(backupPath, JSON.stringify({ ...content, _savedAt: new Date().toISOString() }, null, 2))
  } catch (err) {
    console.error('[admin/save] Backup write failed:', err)
  }

  return NextResponse.json({ ok: true })
}
