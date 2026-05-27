import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

async function verifyAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const allowed = process.env.ADMIN_EMAIL
  if (allowed && user.email !== allowed) return null
  return user
}

const settingsSchema = z.object({
  voting_enabled: z.boolean(),
  voting_start: z.string().datetime({ offset: true }).nullable().optional(),
  voting_end: z.string().datetime({ offset: true }).nullable().optional(),
})

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase.from('settings').select('*').single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  // Handle local datetime strings (no timezone)
  if (body && typeof body === 'object') {
    const b = body as Record<string, unknown>
    if (b.voting_start && typeof b.voting_start === 'string' && !b.voting_start.includes('Z') && !b.voting_start.includes('+')) {
      b.voting_start = b.voting_start + ':00+05:30' // SLST
    }
    if (b.voting_end && typeof b.voting_end === 'string' && !b.voting_end.includes('Z') && !b.voting_end.includes('+')) {
      b.voting_end = b.voting_end + ':00+05:30'
    }
  }

  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('settings')
    .update({
      voting_enabled: parsed.data.voting_enabled,
      voting_start: parsed.data.voting_start ?? null,
      voting_end: parsed.data.voting_end ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', (await supabase.from('settings').select('id').single()).data?.id)
    .select()
    .single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  await supabase.from('admin_logs').insert({
    action: 'SETTINGS_UPDATED',
    details: { voting_enabled: parsed.data.voting_enabled },
    admin_id: user.id,
  })

  return NextResponse.json({ success: true, data })
}
