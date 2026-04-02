import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isValidAdminToken } from '@/lib/admin-auth'
import { getSiteContent } from '@/lib/edge-config'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('majestic_admin')
  if (!cookie || !isValidAdminToken(cookie.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const content = await getSiteContent()
  return NextResponse.json(content)
}
