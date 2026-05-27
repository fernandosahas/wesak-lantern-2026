'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { cn, formatNumber, calcPercentage } from '@/lib/utils'
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
  const sorted = [...lanterns].sort((a, b) => b.vote_count - a.vote_count)
  const totalVotes = lanterns.reduce((sum, l) => sum + l.vote_count, 0)

  if (totalVotes === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center border border-border">
        <div className="text-6xl mb-4">🏮</div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No votes yet
        </h3>
        <p className="text-muted-foreground">
          Be the first to vote and help shape the leaderboard!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Total votes banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 border border-gold-500/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold-500" />
          <span className="text-muted-foreground text-sm">Total Votes Cast</span>
        </div>
        <span className="font-display text-2xl font-bold gold-text">
          {formatNumber(totalVotes)}
        </span>
      </motion.div>

      {/* Leaderboard rows */}
      <div className="space-y-3">
        {sorted.map((lantern, index) => {
          const rank = index + 1
          const pct = calcPercentage(lantern.vote_count, totalVotes)
          const rankInfo = rankIcons[index]

          return (
            <motion.div
              key={lantern.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className={cn(
                'glass rounded-2xl p-4 border transition-all duration-300',
                rank === 1
                  ? 'border-yellow-500/30 bg-yellow-500/5'
                  : rank === 2
                  ? 'border-slate-400/20'
                  : rank === 3
                  ? 'border-amber-700/20'
                  : 'border-border hover:border-gold-500/20'
              )}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center font-display font-bold',
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
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold text-foreground text-sm truncate">
                        {lantern.name}
                      </p>
                      <p className="text-muted-foreground text-xs truncate">
                        {lantern.team_name}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold text-gold-400 text-sm">
                        {formatNumber(lantern.vote_count)}
                      </p>
                      <p className="text-muted-foreground text-xs">{pct}%</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full vote-progress rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: index * 0.08, ease: 'easeOut' }}
                    />
                  </div>
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
