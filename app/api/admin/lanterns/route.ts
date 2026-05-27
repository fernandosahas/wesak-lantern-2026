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

const createSchema = z.object({
  name: z.string().min(1).max(100),
  team_name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
})

const updateSchema = createSchema.extend({
  id: z.string().uuid(),
})

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('lanterns')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Check max 12 lanterns
  const { count } = await supabase.from('lanterns').select('*', { count: 'exact', head: true })
  if ((count ?? 0) >= 12) {
    return NextResponse.json({ success: false, error: 'Maximum 12 lanterns allowed' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('lanterns')
    .insert({
      name: parsed.data.name,
      team_name: parsed.data.team_name,
      description: parsed.data.description || null,
      image_url: parsed.data.image_url || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  await supabase.from('admin_logs').insert({
    action: 'LANTERN_CREATED',
    details: { lantern_id: data.id, name: data.name },
    admin_id: user.id,
  })

  return NextResponse.json({ success: true, data })
}

export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { id, ...fields } = parsed.data
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('lanterns')
    .update({
      name: fields.name,
      team_name: fields.team_name,
      description: fields.description || null,
      image_url: fields.image_url || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  await supabase.from('admin_logs').insert({
    action: 'LANTERN_UPDATED',
    details: { lantern_id: id, name: fields.name },
    admin_id: user.id,
  })

  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = z.object({ id: z.string().uuid() }).safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid lantern ID' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('lanterns').delete().eq('id', parsed.data.id)

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  await supabase.from('admin_logs').insert({
    action: 'LANTERN_DELETED',
    details: { lantern_id: parsed.data.id },
    admin_id: user.id,
  })

  return NextResponse.json({ success: true })
}
