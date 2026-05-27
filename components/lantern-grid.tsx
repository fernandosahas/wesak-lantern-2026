'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LanternCard } from './lantern-card'
import { LanternModal } from './lantern-modal'
import type { Lantern } from '@/types'

interface LanternGridProps {
  lanterns: Lantern[]
  votingEnabled: boolean
  votingEnd: string | null
}

const VOTED_KEY = 'wesak_2026_voted_lantern'

export function LanternGrid({ lanterns, votingEnabled, votingEnd }: LanternGridProps) {
  const [votedLanternId, setVotedLanternId] = useState<string | null>(null)
  const [optimisticCounts, setOptimisticCounts] = useState<Record<string, number>>({})
  const [selectedLantern, setSelectedLantern] = useState<Lantern | null>(null)

  useEffect(() => {
    // Check localStorage for existing vote
    const stored = localStorage.getItem(VOTED_KEY)
    if (stored) setVotedLanternId(stored)
  }, [])

  const handleVoteSuccess = (lanternId: string) => {
    // Store in localStorage
    localStorage.setItem(VOTED_KEY, lanternId)
    setVotedLanternId(lanternId)

    // Optimistic update to vote count
    setOptimisticCounts((prev) => ({
      ...prev,
      [lanternId]: (prev[lanternId] || 0) + 1,
    }))
  }

  const displayLanterns = lanterns.map((l) => ({
    ...l,
    vote_count: l.vote_count + (optimisticCounts[l.id] || 0),
  }))

  // Check if voting period has ended
  const isVotingOver = votingEnd ? new Date(votingEnd) < new Date() : false

  return (
    <>
      {!votingEnabled && !votedLanternId && !isVotingOver && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-gold-500/20 rounded-2xl p-4 mb-8 text-center"
        >
          <p className="text-gold-400 font-medium">
            👀 Voting is not yet open. Browse the lanterns below!
          </p>
        </motion.div>
      )}

      {isVotingOver && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-red-500/20 rounded-2xl p-4 mb-8 text-center"
        >
          <p className="text-red-400 font-medium">
            🔒 Voting has ended. Thank you for participating!
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayLanterns.map((lantern, index) => (
          <motion.div
            key={lantern.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
          >
            <LanternCard
              lantern={lantern}
              votingEnabled={votingEnabled && !isVotingOver}
              hasVoted={!!votedLanternId}
              isVotedByMe={votedLanternId === lantern.id}
              onVoteSuccess={handleVoteSuccess}
              onViewDetails={() => setSelectedLantern(lantern)}
            />
          </motion.div>
        ))}
      </div>

      {selectedLantern && (
        <LanternModal
          lantern={selectedLantern}
          votingEnabled={votingEnabled && !isVotingOver}
          hasVoted={!!votedLanternId}
          isVotedByMe={votedLanternId === selectedLantern.id}
          onVoteSuccess={handleVoteSuccess}
          onClose={() => setSelectedLantern(null)}
        />
      )}
    </>
  )
}
