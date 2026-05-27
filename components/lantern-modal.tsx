'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Users, Share2, Trophy } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { VoteButton } from './vote-button'
import type { Lantern } from '@/types'

interface LanternModalProps {
  lantern: Lantern
  votingEnabled: boolean
  hasVoted: boolean
  isVotedByMe: boolean
  onVoteSuccess: (id: string) => void
  onClose: () => void
}

export function LanternModal({
  lantern,
  votingEnabled,
  hasVoted,
  isVotedByMe,
  onVoteSuccess,
  onClose,
}: LanternModalProps) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out "${lantern.name}" by ${lantern.team_name} at the Wesak Lantern Competition 2026! 🏮`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: lantern.name, text: shareText, url: shareUrl })
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      // toast handled elsewhere
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={cn(
            'relative glass-strong rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto',
            'border',
            isVotedByMe ? 'border-gold-500/40 voted-glow' : 'border-border'
          )}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 glass rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Image */}
          <div className="relative aspect-video w-full bg-secondary">
            {lantern.image_url ? (
              <Image
                src={lantern.image_url}
                alt={lantern.name}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl">🏮</span>
              </div>
            )}

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

            {/* Vote count badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Heart className={cn('h-4 w-4 text-gold-500', lantern.vote_count > 0 && 'fill-gold-500')} />
                <span className="font-bold text-gold-400 text-sm">{formatNumber(lantern.vote_count)}</span>
                <span className="text-muted-foreground text-xs">votes</span>
              </div>
              {isVotedByMe && (
                <div className="glass bg-gold-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-gold-500/40">
                  <Trophy className="h-4 w-4 text-gold-500 fill-gold-500/40" />
                  <span className="text-gold-400 text-xs font-semibold">Your Vote</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold gold-text mb-1">
                  {lantern.name}
                </h2>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">by {lantern.team_name}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex-shrink-0 glass p-2.5 rounded-xl text-muted-foreground hover:text-gold-400 transition-colors"
                aria-label="Share this lantern"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {lantern.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">
                {lantern.description}
              </p>
            )}

            <div className="section-divider mb-6" />

            <VoteButton
              lanternId={lantern.id}
              lanternName={lantern.name}
              votingEnabled={votingEnabled}
              hasVoted={hasVoted}
              isVotedByMe={isVotedByMe}
              onSuccess={onVoteSuccess}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
