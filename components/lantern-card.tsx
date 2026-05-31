'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VoteButton } from './vote-button'
import type { Lantern } from '@/types'

interface LanternCardProps {
  lantern: Lantern
  votingEnabled: boolean
  hasVoted: boolean
  isVotedByMe: boolean
  onVoteSuccess: (id: string) => void
  onViewDetails: () => void
}

export function LanternCard({
  lantern,
  votingEnabled,
  hasVoted,
  isVotedByMe,
  onVoteSuccess,
  onViewDetails,
}: LanternCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={cn(
        'lantern-card group rounded-2xl overflow-hidden border transition-colors duration-200 cursor-pointer',
        isVotedByMe
          ? 'border-gold-500/60 voted-glow'
          : 'border-border hover:border-gold-500/30'
      )}
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-secondary"
        onClick={onViewDetails}
      >
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}

        {imageError || !lantern.image_url ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary">
            <span className="text-6xl mb-2">🏮</span>
            <p className="text-muted-foreground text-sm">{lantern.name}</p>
          </div>
        ) : (
          <Image
            src={lantern.image_url}
            alt={lantern.name}
            fill
            className={cn(
              'object-cover transition-opacity duration-200 sm:transition-transform sm:duration-300 sm:group-hover:scale-[1.03]',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100" />

        {/* Voted badge */}
        {isVotedByMe && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-3 right-3 bg-gold-500 text-black text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            My Vote
          </motion.div>
        )}

        {/* View button */}
        <button
          onClick={onViewDetails}
          className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label={`View ${lantern.name} details`}
        >
          <div className="glass-strong px-4 py-2 rounded-full flex items-center gap-2 text-gold-400 text-sm font-medium">
            <Eye className="h-4 w-4" />
            View Details
          </div>
        </button>
      </div>

      {/* Card body */}
      <div className="p-4 sm:p-5">
        <div className="mb-3">
          <h3 className="font-display font-semibold text-foreground text-lg leading-tight mb-1">
            {lantern.name}
          </h3>
          <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
            <span className="text-gold-500/70">Team:</span>
            <span className="truncate">{lantern.team_name}</span>
          </p>
        </div>

        {lantern.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {lantern.description}
          </p>
        )}

        {isVotedByMe && (
          <div className="mb-4 flex items-center gap-1 text-gold-500 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>You voted!</span>
          </div>
        )}

        {/* Vote button */}
        <VoteButton
          lanternId={lantern.id}
          lanternName={lantern.name}
          votingEnabled={votingEnabled}
          hasVoted={hasVoted}
          isVotedByMe={isVotedByMe}
          onSuccess={onVoteSuccess}
        />
      </div>
    </div>
  )
}
