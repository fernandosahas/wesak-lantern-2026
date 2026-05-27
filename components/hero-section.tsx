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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      {/* Background decorative lanterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <FloatingLantern key={i} index={i} />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
        >
          <Star className="h-3.5 w-3.5 text-gold-500 fill-gold-500" />
          <span className="text-sm text-gold-400 font-medium">
            B/Badulla Central College
          </span>
          <Star className="h-3.5 w-3.5 text-gold-500 fill-gold-500" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
        >
          <span className="text-foreground">Wesak</span>
          <br />
          <span className="gold-text-animated">Lantern</span>
          <br />
          <span className="text-foreground">Competition</span>
        </motion.h1>

        {/* Year */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/50" />
          <span className="font-display text-2xl text-gold-500 font-semibold tracking-widest">
            2026
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/50" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Celebrate the Festival of Lights by voting for your favourite handcrafted
          Wesak lantern. {lanternCount} magnificent lanterns await your vote.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="#vote"
            className="btn-gold px-8 py-4 rounded-full text-base font-bold text-black inline-flex items-center gap-2 min-w-[180px] justify-center"
          >
            🏮 {votingEnabled ? 'Vote Now' : 'View Lanterns'}
          </Link>
          <Link
            href="#leaderboard"
            className="glass px-8 py-4 rounded-full text-base font-semibold text-gold-400 hover:bg-gold-500/10 transition-colors inline-flex items-center gap-2 min-w-[180px] justify-center"
          >
            📊 View Rankings
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { label: 'Lanterns', value: lanternCount.toString() },
            { label: 'Competition', value: 'Annual' },
            { label: 'Festival', value: 'Wesak 2026' },
          ].map((stat) => (
            <div key={stat.label} className="glass px-6 py-4 rounded-2xl min-w-[120px]">
              <p className="font-display text-2xl font-bold gold-text">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      className="absolute opacity-20"
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
