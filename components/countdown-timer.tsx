'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { CountdownState } from '@/types'

interface CountdownTimerProps {
  targetDate: Date
  onComplete?: () => void
}

function getCountdown(target: Date): CountdownState {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds, isOver: false }
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [state, setState] = useState<CountdownState>(() => getCountdown(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getCountdown(targetDate)
      setState(next)
      if (next.isOver) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  if (state.isOver) {
    return (
      <div className="text-center">
        <p className="text-gold-400 text-xl font-semibold animate-pulse-gold">
          🏮 Voting is now open!
        </p>
      </div>
    )
  }

  const units = [
    { label: 'Days', value: state.days },
    { label: 'Hours', value: state.hours },
    { label: 'Minutes', value: state.minutes },
    { label: 'Seconds', value: state.seconds },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {units.map((unit, i) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] text-center relative overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gold-500/5 rounded-2xl" />

          <motion.span
            key={unit.value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-3xl md:text-5xl font-bold gold-text block relative z-10"
          >
            {String(unit.value).padStart(2, '0')}
          </motion.span>
          <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest mt-1 block relative z-10">
            {unit.label}
          </span>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl border border-gold-500/20 animate-pulse-gold" />
        </motion.div>
      ))}
    </div>
  )
}
