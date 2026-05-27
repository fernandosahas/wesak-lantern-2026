'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Power, Calendar, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Settings } from '@/types'

interface VotingToggleProps {
  settings: Settings | null
}

export function VotingToggle({ settings }: VotingToggleProps) {
  const [enabled, setEnabled] = useState(settings?.voting_enabled ?? false)
  const [votingStart, setVotingStart] = useState(
    settings?.voting_start ? settings.voting_start.slice(0, 16) : ''
  )
  const [votingEnd, setVotingEnd] = useState(
    settings?.voting_end ? settings.voting_end.slice(0, 16) : ''
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voting_enabled: enabled,
          voting_start: votingStart || null,
          voting_end: votingEnd || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Settings saved! 🏮')
      } else {
        toast.error(data.error || 'Failed to save settings')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-6 border border-border space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-foreground">Voting Control</h2>
        <div className={cn(
          'px-3 py-1 rounded-full text-xs font-semibold border',
          enabled
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        )}>
          {enabled ? '🟢 OPEN' : '🔴 CLOSED'}
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setEnabled(!enabled)}
          className={cn(
            'relative w-14 h-7 rounded-full transition-colors duration-300 border',
            enabled
              ? 'bg-green-500/20 border-green-500/40'
              : 'bg-secondary border-border'
          )}
        >
          <motion.div
            animate={{ x: enabled ? 28 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'absolute top-1 w-5 h-5 rounded-full',
              enabled ? 'bg-green-400' : 'bg-muted-foreground'
            )}
          />
        </button>
        <div>
          <p className="font-medium text-foreground text-sm">
            {enabled ? 'Voting is OPEN' : 'Voting is CLOSED'}
          </p>
          <p className="text-muted-foreground text-xs">
            {enabled ? 'Users can currently cast votes' : 'Voting is disabled for all users'}
          </p>
        </div>
      </div>

      {/* Date/time pickers */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            Voting Start (SLST)
          </label>
          <input
            type="datetime-local"
            value={votingStart}
            onChange={(e) => setVotingStart(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            Voting End (SLST)
          </label>
          <input
            type="datetime-local"
            value={votingEnd}
            onChange={(e) => setVotingEnd(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-gold px-6 py-2.5 rounded-xl font-semibold text-black text-sm flex items-center gap-2 disabled:opacity-60"
      >
        {saving ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          <><Power className="h-4 w-4" /> Save Settings</>
        )}
      </button>
    </div>
  )
}
