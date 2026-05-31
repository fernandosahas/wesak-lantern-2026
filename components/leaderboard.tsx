'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import type { Lantern } from '@/types'

interface LeaderboardProps {
  lanterns: Lantern[]
}

const rankIcons = [
  { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', size: 'h-5 w-5' },
  { icon: Medal, color: 'text-slate-300', bg: 'bg-slate-400/10 border-slate-400/30', size: 'h-5 w-5' },
  { icon: Award, color: 'text-amber-600', bg: 'bg-amber-600/10 border-amber-600/30', size: 'h-5 w-5' },
]

export function Leaderboard({ lanterns }: LeaderboardProps) {
  const sorted = [...lanterns].sort(
    (a, b) => b.vote_count - a.vote_count || a.name.localeCompare(b.name)
  )

  if (sorted.length === 0) {
    return (
      <div className="rounded-3xl border border-border glass p-8 text-center sm:p-12">
        <div className="mb-4 text-5xl sm:text-6xl">🏮</div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No lanterns yet
        </h3>
        <p className="text-muted-foreground">
          Lantern rankings will appear here once entries are added.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Leaderboard rows */}
      <div className="space-y-3">
        {sorted.map((lantern, index) => {
          const rank = index + 1
          const rankInfo = rankIcons[index]

          return (
            <motion.div
              key={lantern.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className={cn(
                'rounded-2xl border glass p-3.5 transition-all duration-300 sm:p-4',
                rank === 1
                  ? 'border-yellow-500/30 bg-yellow-500/5'
                  : rank === 2
                  ? 'border-slate-400/20'
                  : rank === 3
                  ? 'border-amber-700/20'
                  : 'border-border hover:border-gold-500/20'
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Rank */}
                <div
                  className={cn(
                    'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border font-display font-bold sm:h-10 sm:w-10',
                    rankInfo
                      ? `${rankInfo.bg} ${rankInfo.color}`
                      : 'bg-secondary border-border text-muted-foreground'
                  )}
                >
                  {rankInfo ? (
                    <rankInfo.icon className={rankInfo.size} />
                  ) : (
                    <span className="text-sm">#{rank}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-display text-lg font-semibold text-foreground">
                    {lantern.name}
                  </p>
                </div>
                <div className="flex-shrink-0 rounded-xl border border-gold-500/20 bg-gold-500/10 px-3 py-1.5 text-right">
                  <p className="font-display text-base font-bold text-gold-400">
                    {formatNumber(lantern.vote_count)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    votes
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="text-center text-muted-foreground text-xs mt-4">
        Updates in real-time · Last refreshed at {new Date().toLocaleTimeString('en-LK')}
      </p>
    </div>
  )
}
