/**
 * DISASTER RECOVERY SCRIPT
 * ─────────────────────────────────────────────────────────────
 * If Edge Config is ever wiped, run this to restore all content:
 *
 *   npx ts-node scripts/restore-from-backup.ts
 *
 * Requires: VERCEL_API_TOKEN and EDGE_CONFIG_ID in .env.local
 */

import { readFileSync } from 'fs'
import path from 'path'

async function restore() {
  const token = process.env.VERCEL_API_TOKEN
  const configId = process.env.EDGE_CONFIG_ID

  if (!token || !configId) {
    console.error('❌ Missing VERCEL_API_TOKEN or EDGE_CONFIG_ID in environment')
    process.exit(1)
  }

  const backupPath = path.join(__dirname, '../src/config/content-backup.json')
  let content: Record<string, unknown>

  try {
    content = JSON.parse(readFileSync(backupPath, 'utf-8'))
    delete content._savedAt
    console.log('✓ Loaded backup from', backupPath)
  } catch {
    console.error('❌ No backup file found at', backupPath)
    process.exit(1)
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

  if (res.ok) {
    console.log('✓ Edge Config restored successfully')
    console.log('  All content is live — no redeploy needed')
  } else {
    const err = await res.text()
    console.error('❌ Restore failed:', res.status, err)
    process.exit(1)
  }
}

restore()
