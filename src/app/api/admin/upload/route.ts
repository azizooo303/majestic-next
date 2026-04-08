import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { isValidAdminToken } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  // Verify admin session
  const cookie = request.cookies.get('majestic_admin')
  if (!cookie || !isValidAdminToken(cookie.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Upload to Cloudinary
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')
  const dataUrl = `data:${file.type};base64,${base64}`

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'majestic-admin'

  // Generate Cloudinary signature
  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex')

  const cloudinaryForm = new FormData()
  cloudinaryForm.append('file', dataUrl)
  cloudinaryForm.append('api_key', apiKey)
  cloudinaryForm.append('timestamp', String(timestamp))
  cloudinaryForm.append('signature', signature)
  cloudinaryForm.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: cloudinaryForm }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('[upload] Cloudinary error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ url: data.secure_url, publicId: data.public_id })
}
