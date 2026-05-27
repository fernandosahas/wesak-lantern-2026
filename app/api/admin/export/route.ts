import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

async function verifyAdmin(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const allowed = process.env.ADMIN_EMAIL
  if (allowed && user.email !== allowed) return null
  return user
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: votes, error } = await supabase
    .from('votes')
    .select('id, lantern_id, ip_hash, device_hash, created_at, lanterns(name, team_name)')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  // Build CSV manually (no external dependency)
  const headers = ['ID', 'Lantern Name', 'Team', 'IP Hash', 'Device Hash', 'Voted At']
  const rows = (votes ?? []).map((v: Record<string, unknown>) => {
    const lantern = v.lanterns as Record<string, string> | null
    return [
      v.id,
      lantern?.name ?? 'Unknown',
      lantern?.team_name ?? 'Unknown',
      v.ip_hash,
      v.device_hash,
      new Date(v.created_at as string).toLocaleString('en-LK', { timeZone: 'Asia/Colombo' }),
    ].map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
     .join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  const filename = `wesak-votes-${new Date().toISOString().slice(0, 10)}.csv`

  // Log the export
  await supabase.from('admin_logs').insert({
    action: 'VOTES_EXPORTED',
    details: { count: votes?.length ?? 0 },
    admin_id: user.id,
  })

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
