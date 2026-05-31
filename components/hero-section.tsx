'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, Star } from 'lucide-react'

interface HeroSectionProps {
  votingEnabled: boolean
  lanternCount: number
}

export function HeroSection({ votingEnabled, lanternCount }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[92svh] flex-col items-center justify-center px-4 pb-10 pt-24 sm:min-h-screen sm:pt-24">
      {/* Background decorative lanterns */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
        {[...Array(8)].map((_, i) => (
          <FloatingLantern key={i} index={i} />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-72 w-72 rounded-full bg-gold-500/5 blur-[70px] sm:h-[600px] sm:w-[600px] sm:blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full glass px-3 py-2 sm:mb-8 sm:px-4"
        >
          <Star className="h-3.5 w-3.5 text-gold-500 fill-gold-500" />
          <span className="truncate text-xs font-medium text-gold-400 sm:text-sm">
            B/Badulla Central College
          </span>
          <Star className="h-3.5 w-3.5 text-gold-500 fill-gold-500" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-5 font-display text-4xl font-bold leading-[1.15] tracking-normal sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="text-foreground">ශාක්‍යමුණි</span>
          <br />
          <span className="gold-text-animated">වන්දනා</span>
        </motion.h1>

        {/* Year */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-5 flex items-center justify-center gap-3 sm:gap-4"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/50 sm:w-16" />
          <span className="font-display text-xl font-semibold tracking-widest text-gold-500 sm:text-2xl">
            2026
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/50 sm:w-16" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mb-10 md:text-xl"
        >
          Celebrate the Festival of Lights by voting for your favourite handcrafted
          Vesak lantern. {lanternCount} magnificent lanterns await your vote.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="#vote"
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full btn-gold px-6 py-3.5 text-base font-bold text-black sm:w-auto sm:min-w-[180px] sm:px-8 sm:py-4"
          >
            🏮 {votingEnabled ? 'Vote Now' : 'View Lanterns'}
          </Link>
          <Link
            href="#leaderboard"
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full glass px-6 py-3.5 text-base font-semibold text-gold-400 transition-colors hover:bg-gold-500/10 sm:w-auto sm:min-w-[180px] sm:px-8 sm:py-4"
          >
            📊 View Rankings
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 grid w-full grid-cols-3 gap-2 text-center sm:mt-16 sm:flex sm:flex-wrap sm:justify-center sm:gap-8"
        >
          {[
            { label: 'Lanterns', value: lanternCount.toString() },
            { label: 'Competition', value: 'Annual' },
            { label: 'Festival', value: 'Vesak 2026' },
          ].map((stat) => (
            <div key={stat.label} className="min-w-0 rounded-2xl glass px-3 py-3 sm:min-w-[120px] sm:px-6 sm:py-4">
              <p className="truncate font-display text-xl font-bold gold-text sm:text-2xl">{stat.value}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-1 text-muted-foreground/50"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function FloatingLantern({ index }: { index: number }) {
  const positions = [
    { left: '5%', top: '15%', size: 40, delay: 0 },
    { left: '90%', top: '20%', size: 32, delay: 0.5 },
    { left: '12%', top: '65%', size: 28, delay: 1 },
    { left: '85%', top: '70%', size: 44, delay: 0.3 },
    { left: '45%', top: '8%', size: 24, delay: 0.7 },
    { left: '70%', top: '45%', size: 36, delay: 1.2 },
    { left: '25%', top: '85%', size: 30, delay: 0.2 },
    { left: '60%', top: '80%', size: 26, delay: 0.9 },
  ]

  const pos = positions[index] || positions[0]

  return (
    <motion.div
      className={`absolute opacity-20 ${index > 3 ? 'hidden sm:block' : ''}`}
      style={{ left: pos.left, top: pos.top }}
      animate={{
        y: [0, -15, 0],
        rotate: [-3, 3, -3],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        repeat: Infinity,
        duration: 4 + index * 0.5,
        delay: pos.delay,
        ease: 'easeInOut',
      }}
    >
      <div
        style={{ width: pos.size, height: pos.size * 1.4 }}
        className="relative"
      >
        {/* Lantern string */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-gold-500/50" />
        {/* Lantern body */}
        <div
          className="rounded-full border border-gold-500/40"
          style={{
            width: pos.size,
            height: pos.size * 1.2,
            background: `radial-gradient(ellipse at 40% 35%, rgba(245,158,11,0.4), rgba(220,38,38,0.2))`,
            boxShadow: `0 0 ${pos.size}px rgba(245,158,11,0.3)`,
            marginTop: 12,
          }}
        />
        {/* Lantern bottom tassel */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-px h-3 bg-gold-500/40" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
