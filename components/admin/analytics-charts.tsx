'use client'

import { motion } from 'framer-motion'
import { formatNumber, calcPercentage } from '@/lib/utils'

interface AnalyticsProps {
  lanterns: Array<{ id: string; name: string; team_name: string; vote_count: number }>
  votesOverTime: Array<{ created_at: string; lantern_id: string }>
}

export function AnalyticsCharts({ lanterns, votesOverTime }: AnalyticsProps) {
  const totalVotes = lanterns.reduce((s, l) => s + l.vote_count, 0)

  // Group votes by hour for sparkline
  const hourlyMap: Record<string, number> = {}
  votesOverTime.forEach((v) => {
    const hour = new Date(v.created_at).toISOString().slice(0, 13)
    hourlyMap[hour] = (hourlyMap[hour] || 0) + 1
  })
  const hourlyData = Object.entries(hourlyMap).slice(-24).map(([h, c]) => ({
    label: new Date(h).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }),
    count: c,
  }))
  const maxHourly = Math.max(...hourlyData.map((d) => d.count), 1)

  const barColors = [
    '#f59e0b', '#fbbf24', '#d97706', '#b45309',
    '#ea580c', '#dc2626', '#7c3aed', '#2563eb',
    '#16a34a', '#0891b2', '#db2777', '#65a30d',
  ]

  return (
    <div className="space-y-6">
      {/* Vote distribution bar chart */}
      <div className="glass rounded-2xl p-6 border border-border">
        <h2 className="font-display font-semibold text-lg text-foreground mb-6">
          Vote Distribution
        </h2>
        {totalVotes === 0 ? (
          <p className="text-muted-foreground text-center py-8">No votes yet</p>
        ) : (
          <div className="space-y-4">
            {lanterns.map((lantern, i) => {
              const pct = calcPercentage(lantern.vote_count, totalVotes)
              return (
                <div key={lantern.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium truncate max-w-[60%]">{lantern.name}</span>
                    <span className="text-muted-foreground flex-shrink-0">
                      {formatNumber(lantern.vote_count)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: barColors[i % barColors.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Votes over time */}
      <div className="glass rounded-2xl p-6 border border-border">
        <h2 className="font-display font-semibold text-lg text-foreground mb-6">
          Votes Per Hour (Last 24 Hours)
        </h2>
        {hourlyData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No data available</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {hourlyData.map((d, i) => {
              const heightPct = (d.count / maxHourly) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="glass-strong rounded-lg px-2 py-1 text-xs text-foreground whitespace-nowrap border border-gold-500/20">
                      {d.label}: {d.count} votes
                    </div>
                  </div>
                  <motion.div
                    className="w-full rounded-t-sm vote-progress min-h-[2px]"
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${Math.max(heightPct, 2)}%`, opacity: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.4 }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary table */}
      <div className="glass rounded-2xl p-6 border border-border overflow-x-auto">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">
          Detailed Standings
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">Rank</th>
              <th className="pb-3 font-medium">Lantern</th>
              <th className="pb-3 font-medium">Team</th>
              <th className="pb-3 font-medium text-right">Votes</th>
              <th className="pb-3 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {lanterns.map((l, i) => (
              <tr key={l.id} className="hover:bg-secondary/30 transition-colors">
                <td className="py-3 text-muted-foreground">#{i + 1}</td>
                <td className="py-3 text-foreground font-medium">{l.name}</td>
                <td className="py-3 text-muted-foreground">{l.team_name}</td>
                <td className="py-3 text-gold-400 font-bold text-right">{formatNumber(l.vote_count)}</td>
                <td className="py-3 text-muted-foreground text-right">{calcPercentage(l.vote_count, totalVotes)}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gold-500/20">
              <td colSpan={3} className="pt-3 font-semibold text-foreground">Total</td>
              <td className="pt-3 font-bold text-gold-400 text-right">{formatNumber(totalVotes)}</td>
              <td className="pt-3 text-muted-foreground text-right">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
