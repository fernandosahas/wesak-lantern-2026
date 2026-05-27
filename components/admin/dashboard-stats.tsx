'use client'

import { motion } from 'framer-motion'
import { Heart, Lamp, TrendingUp, Trophy } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { Lantern } from '@/types'

interface DashboardStatsProps {
  totalVotes: number
  todayVotes: number
  totalLanterns: number
  topLantern: Lantern | null
}

export function DashboardStats({ totalVotes, todayVotes, totalLanterns, topLantern }: DashboardStatsProps) {
  const cards = [
    {
      label: 'Total Votes',
      value: formatNumber(totalVotes),
      icon: Heart,
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/20',
      glow: 'hover:border-red-400/40',
    },
    {
      label: 'Votes Today',
      value: formatNumber(todayVotes),
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-400/10 border-green-400/20',
      glow: 'hover:border-green-400/40',
    },
    {
      label: 'Total Lanterns',
      value: totalLanterns.toString(),
      icon: Lamp,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20',
      glow: 'hover:border-blue-400/40',
    },
    {
      label: 'Leading Lantern',
      value: topLantern ? topLantern.name : 'No votes yet',
      sub: topLantern ? `${formatNumber(topLantern.vote_count)} votes` : '',
      icon: Trophy,
      color: 'text-gold-500',
      bg: 'bg-gold-500/10 border-gold-500/20',
      glow: 'hover:border-gold-500/40',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`glass rounded-2xl p-5 border transition-all duration-200 ${card.glow}`}
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-muted-foreground text-sm">{card.label}</p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <p className={`font-display text-2xl font-bold ${card.color} truncate`}>
            {card.value}
          </p>
          {card.sub && (
            <p className="text-muted-foreground text-xs mt-1">{card.sub}</p>
          )}
        </motion.div>
      ))}
    </div>
  )
}
