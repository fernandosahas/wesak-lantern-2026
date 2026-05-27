'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Smartphone, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface RulesSectionProps {
  votingStart: Date | null
  votingEnd: Date | null
}

const rules = [
  {
    icon: CheckCircle2,
    title: 'One Vote Per Person',
    description: 'Each person may cast exactly one vote for their favourite lantern. Choose wisely!',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
  {
    icon: Clock,
    title: 'Vote During Open Period',
    description: 'Voting is only allowed during the designated voting period. Check the countdown timer above.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: Smartphone,
    title: 'One Device, One Vote',
    description: 'Votes are tracked per device. Attempting to vote from multiple devices will be detected.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    icon: Shield,
    title: 'Fair Play Required',
    description: 'Any attempt to manipulate votes will result in disqualification. Keep it fair and fun!',
    color: 'text-gold-500',
    bg: 'bg-gold-500/10 border-gold-500/20',
  },
  {
    icon: AlertTriangle,
    title: 'No Vote Buying',
    description: 'Votes must be cast freely. Any form of coercion or vote buying is strictly prohibited.',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/20',
  },
]

export function RulesSection({ votingStart, votingEnd }: RulesSectionProps) {
  const formatDate = (date: Date) =>
    date.toLocaleString('en-LK', {
      timeZone: 'Asia/Colombo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div>
      <div className="text-center mb-12">
        <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
          📋 Guidelines
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          Competition <span className="gold-text">Rules</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Please read the rules carefully before voting to ensure a fair competition.
        </p>
      </div>

      {/* Voting schedule */}
      {(votingStart || votingEnd) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 border border-gold-500/20 mb-8 text-center"
        >
          <h3 className="font-display font-semibold text-gold-400 mb-4">
            🕐 Voting Schedule
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {votingStart && (
              <div className="glass rounded-xl p-4">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Voting Opens</p>
                <p className="text-foreground font-medium">{formatDate(votingStart)}</p>
                <p className="text-gold-500/60 text-xs mt-1">Sri Lanka Standard Time</p>
              </div>
            )}
            {votingEnd && (
              <div className="glass rounded-xl p-4">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Voting Closes</p>
                <p className="text-foreground font-medium">{formatDate(votingEnd)}</p>
                <p className="text-gold-500/60 text-xs mt-1">Sri Lanka Standard Time</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Rules grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass rounded-2xl p-5 border ${rule.bg} flex gap-4`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${rule.bg}`}>
              <rule.icon className={`h-5 w-5 ${rule.color}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${rule.color} mb-1`}>{rule.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{rule.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Anti-cheat notice */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-6 glass rounded-2xl p-4 border border-border text-center"
      >
        <p className="text-muted-foreground text-sm">
          🔒 This competition is protected by{' '}
          <span className="text-gold-400">Cloudflare Turnstile</span>, IP protection,
          browser fingerprinting, and rate limiting to ensure a fair vote count.
        </p>
      </motion.div>
    </div>
  )
}
