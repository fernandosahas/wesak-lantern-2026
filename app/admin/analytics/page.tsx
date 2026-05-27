import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { AnalyticsCharts } from '@/components/admin/analytics-charts'

export const metadata: Metadata = { title: 'Analytics' }
export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function AnalyticsPage() {
  const supabase = createServiceClient()

  const [{ data: lanterns }, { data: votesOverTime }] = await Promise.all([
    supabase.from('lanterns').select('id, name, team_name, vote_count').order('vote_count', { ascending: false }),
    supabase
      .from('votes')
      .select('created_at, lantern_id')
      .order('created_at', { ascending: true })
      .gte('created_at', new Date(Date.now() - 7 * 86_400_000).toISOString()),
  ])

  return (
    <div className="space-y-8 pt-16 md:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Analytics</h1>
        <p className="text-muted-foreground mt-1">Vote distribution and trends</p>
      </div>
      <AnalyticsCharts
        lanterns={lanterns || []}
        votesOverTime={votesOverTime || []}
      />
    </div>
  )
}
