'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Eye, Trophy, Loader2, CheckCircle2 } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
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
        'lantern-card group glass rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer',
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
              'object-cover transition-all duration-500 group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={`View ${lantern.name} details`}
        >
          <div className="glass-strong px-4 py-2 rounded-full flex items-center gap-2 text-gold-400 text-sm font-medium">
            <Eye className="h-4 w-4" />
            View Details
          </div>
        </button>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-display font-semibold text-foreground text-lg leading-tight mb-1">
            {lantern.name}
          </h3>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <span className="text-gold-500/70">Team:</span>
            <span>{lantern.team_name}</span>
          </p>
        </div>

        {lantern.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {lantern.description}
          </p>
        )}

        {/* Vote count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-gold-500">
            <Heart className={cn('h-4 w-4', lantern.vote_count > 0 && 'fill-gold-500')} />
            <span className="font-semibold text-sm">
              {formatNumber(lantern.vote_count)}
            </span>
            <span className="text-muted-foreground text-xs">
              {lantern.vote_count === 1 ? 'vote' : 'votes'}
            </span>
          </div>
          {isVotedByMe && (
            <div className="flex items-center gap-1 text-gold-500 text-xs">
              <Trophy className="h-3.5 w-3.5 fill-gold-500" />
              <span>You voted!</span>
            </div>
          )}
        </div>

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
