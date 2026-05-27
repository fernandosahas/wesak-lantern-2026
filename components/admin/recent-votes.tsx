'use client'

import { motion } from 'framer-motion'
import { Clock, Heart } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import type { VoteWithLantern } from '@/types'

interface RecentVotesProps {
  votes: VoteWithLantern[]
}

export function RecentVotes({ votes }: RecentVotesProps) {
  return (
    <div className="glass rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-semibold text-xl text-foreground">
          Recent Votes
        </h2>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="h-3.5 w-3.5" />
          Live updates
        </div>
      </div>

      {votes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Heart className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p>No votes yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {votes.map((vote, i) => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <Heart className="h-3.5 w-3.5 text-gold-500 fill-gold-500/40" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">
                  {vote.lanterns?.name ?? 'Unknown Lantern'}
                </p>
                <p className="text-muted-foreground text-xs truncate">
                  by {vote.lanterns?.team_name ?? '—'}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-muted-foreground text-xs">{timeAgo(vote.created_at)}</p>
                <p className="text-muted-foreground/50 text-xs font-mono">
                  {vote.ip_hash.slice(0, 8)}…
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
