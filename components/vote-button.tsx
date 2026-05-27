'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Loader2, CheckCircle2, Lock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateFingerprint, generateDeviceHash } from '@/lib/fingerprint'
import toast from 'react-hot-toast'
import { VoteSuccessAnimation } from './vote-success-animation'

interface VoteButtonProps {
  lanternId: string
  lanternName: string
  votingEnabled: boolean
  hasVoted: boolean
  isVotedByMe: boolean
  onSuccess: (id: string) => void
}

type ButtonState = 'idle' | 'loading' | 'captcha' | 'submitting' | 'success' | 'error'

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback': () => void
          'expired-callback': () => void
          theme?: string
          size?: string
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export function VoteButton({
  lanternId,
  lanternName,
  votingEnabled,
  hasVoted,
  isVotedByMe,
  onSuccess,
}: VoteButtonProps) {
  const [state, setState] = useState<ButtonState>('idle')
  const [error, setError] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string>('')
  const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

  // Load Turnstile script once
  useEffect(() => {
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [])

  const handleTurnstileSuccess = useCallback(
    async (token: string) => {
      setState('submitting')
      setShowCaptcha(false)

      try {
        const [fingerprint, device_hash] = await Promise.all([
          generateFingerprint(),
          Promise.resolve(generateDeviceHash()),
        ])

        const res = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lantern_id: lanternId,
            turnstile_token: token,
            fingerprint,
            device_hash,
          }),
        })

        const data = await res.json()

        if (data.success) {
          setState('success')
          setShowSuccess(true)
          onSuccess(lanternId)
          toast.success(`🏮 Vote cast for "${lanternName}"!`, { duration: 5000 })
          setTimeout(() => setShowSuccess(false), 3500)
        } else {
          setState('error')
          setError(data.error || 'Failed to cast vote')
          toast.error(data.error || 'Failed to cast vote')
          // Reset after showing error
          setTimeout(() => { setState('idle'); setError('') }, 4000)
        }
      } catch {
        setState('error')
        setError('Network error. Please try again.')
        toast.error('Network error. Please try again.')
        setTimeout(() => { setState('idle'); setError('') }, 4000)
      }
    },
    [lanternId, lanternName, onSuccess]
  )

  const handleVoteClick = () => {
    if (!votingEnabled || hasVoted || state !== 'idle') return

    setShowCaptcha(true)
    setState('captcha')

    // Render Turnstile widget
    setTimeout(() => {
      if (captchaRef.current && window.turnstile) {
        widgetId.current = window.turnstile.render(captchaRef.current, {
          sitekey: SITE_KEY,
          callback: handleTurnstileSuccess,
          'error-callback': () => {
            setError('CAPTCHA verification failed. Please try again.')
            setState('idle')
            setShowCaptcha(false)
          },
          'expired-callback': () => {
            setError('CAPTCHA expired. Please try again.')
            setState('idle')
            setShowCaptcha(false)
          },
          theme: 'dark',
          size: 'compact',
        })
      } else {
        // Turnstile not loaded, try direct vote in dev mode
        if (process.env.NODE_ENV === 'development') {
          handleTurnstileSuccess('dev-token')
        }
      }
    }, 100)
  }

  // Not open for voting
  if (!votingEnabled && !hasVoted) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-xl glass border border-border text-muted-foreground text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed"
      >
        <Lock className="h-4 w-4" />
        Voting Not Open
      </button>
    )
  }

  // Already voted for this one
  if (isVotedByMe) {
    return (
      <div className="w-full py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/40 text-gold-400 text-sm font-semibold flex items-center justify-center gap-2">
        <CheckCircle2 className="h-4 w-4 fill-gold-500/30" />
        You Voted for This! 🏆
      </div>
    )
  }

  // Already voted for another
  if (hasVoted) {
    return (
      <div className="w-full py-2.5 rounded-xl glass border border-border text-muted-foreground text-sm flex items-center justify-center gap-2 cursor-not-allowed">
        <CheckCircle2 className="h-4 w-4" />
        Already Voted
      </div>
    )
  }

  return (
    <>
      {/* Success animation overlay */}
      <AnimatePresence>
        {showSuccess && <VoteSuccessAnimation lanternName={lanternName} />}
      </AnimatePresence>

      {/* Turnstile CAPTCHA popup */}
      <AnimatePresence>
        {showCaptcha && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setShowCaptcha(false)
                setState('idle')
              }}
            />
            <div className="relative glass-strong rounded-2xl p-6 border border-gold-500/20 max-w-sm w-full text-center z-10">
              <h3 className="font-display font-semibold text-foreground mb-2">
                Verify You're Human
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Complete the security check to cast your vote for{' '}
                <strong className="text-gold-400">{lanternName}</strong>
              </p>
              <div ref={captchaRef} className="flex justify-center mb-4" />
              <p className="text-muted-foreground text-xs">
                Protected by Cloudflare Turnstile
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {state === 'error' && error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs flex items-center gap-1 mb-2"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}

      <motion.button
        onClick={handleVoteClick}
        disabled={state !== 'idle'}
        whileHover={state === 'idle' ? { scale: 1.02 } : {}}
        whileTap={state === 'idle' ? { scale: 0.98 } : {}}
        className={cn(
          'w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200',
          state === 'idle'
            ? 'btn-gold text-black cursor-pointer'
            : 'bg-secondary text-muted-foreground cursor-not-allowed',
          state === 'error' && 'bg-red-500/10 text-red-400 border border-red-500/30'
        )}
      >
        {state === 'idle' && (
          <>
            <Heart className="h-4 w-4" />
            Vote for This Lantern
          </>
        )}
        {(state === 'captcha' || state === 'submitting') && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {state === 'captcha' ? 'Verifying...' : 'Casting Vote...'}
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Voted! 🏮
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="h-4 w-4" />
            Try Again
          </>
        )}
      </motion.button>
    </>
  )
}
