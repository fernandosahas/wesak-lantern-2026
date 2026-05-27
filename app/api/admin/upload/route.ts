import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadImage } from '@/lib/cloudinary'

async function verifyAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const allowed = process.env.ADMIN_EMAIL
  if (allowed && user.email !== allowed) return null
  return user
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  let body: { data?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  const { data: base64 } = body
  if (!base64 || !base64.startsWith('data:image/')) {
    return NextResponse.json({ success: false, error: 'Invalid image data' }, { status: 400 })
  }

  // Estimate file size from base64
  const sizeBytes = (base64.length * 3) / 4
  const maxBytes = 10 * 1024 * 1024 // 10 MB
  if (sizeBytes > maxBytes) {
    return NextResponse.json({ success: false, error: 'Image must be under 10 MB' }, { status: 400 })
  }

  try {
    const result = await uploadImage(base64, 'wesak-lanterns-2026')
    return NextResponse.json({ success: true, url: result.url, publicId: result.publicId })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    return NextResponse.json(
      { success: false, error: 'Image upload failed. Check Cloudinary configuration.' },
      { status: 500 }
    )
  }
}
