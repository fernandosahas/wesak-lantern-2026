import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { VotingToggle } from '@/components/admin/voting-toggle'
import { RecentVotes } from '@/components/admin/recent-votes'
import type { Lantern, Settings, VoteWithLantern } from '@/types'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'
export const revalidate = 15

async function getDashboardData() {
  const supabase = createServiceClient()

  const [
    { data: lanterns },
    { data: settings },
    { count: totalVotes },
    { count: todayVotes },
    { data: recentVotes },
  ] = await Promise.all([
    supabase.from('lanterns').select('*').order('vote_count', { ascending: false }),
    supabase.from('settings').select('*').single(),
    supabase.from('votes').select('*', { count: 'exact', head: true }),
    supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 86_400_000).toISOString()),
    supabase
      .from('votes')
      .select('*, lanterns(id, name, team_name)')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  return {
    lanterns: (lanterns as Lantern[]) || [],
    settings: settings as Settings | null,
    totalVotes: totalVotes ?? 0,
    todayVotes: todayVotes ?? 0,
    recentVotes: (recentVotes as VoteWithLantern[]) || [],
  }
}

export default async function DashboardPage() {
  const { lanterns, settings, totalVotes, todayVotes, recentVotes } = await getDashboardData()
  const topLantern = lanterns[0] ?? null

  return (
    <div className="space-y-8 pt-16 md:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Live overview of the Wesak Lantern Competition 2026
        </p>
      </div>

      {/* Stats */}
      <DashboardStats
        totalVotes={totalVotes}
        todayVotes={todayVotes}
        totalLanterns={lanterns.length}
        topLantern={topLantern}
      />

      {/* Voting toggle */}
      <VotingToggle settings={settings} />

      {/* Recent votes */}
      <RecentVotes votes={recentVotes} />
    </div>
  )
}
