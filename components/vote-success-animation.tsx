'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface VoteSuccessAnimationProps {
  lanternName: string
}

export function VoteSuccessAnimation({ lanternName }: VoteSuccessAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; opacity: number; rotation: number; rotationSpeed: number;
    }> = []

    const colors = ['#f59e0b', '#fcd34d', '#d97706', '#dc2626', '#ea580c', '#fbbf24', '#ffffff']

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 4,
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
      })
    }

    let animId: number
    let frame = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.35 // gravity
        p.vx *= 0.99 // drag
        p.opacity -= 0.012
        p.rotation += p.rotationSpeed

        if (p.opacity <= 0) return

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
      })

      if (frame < 200) {
        animId = requestAnimationFrame(animate)
      }
    }

    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
    >
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Success card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative glass-strong rounded-3xl p-8 border border-gold-500/40 text-center max-w-xs mx-4"
        style={{ boxShadow: '0 0 60px rgba(245,158,11,0.4)' }}
      >
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-3xl border-2 border-gold-500/30 animate-ping-slow" />

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl mb-4"
        >
          🏮
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="h-7 w-7 text-black" />
        </motion.div>

        <h3 className="font-display text-2xl font-bold gold-text mb-2">
          Vote Cast! 🎊
        </h3>
        <p className="text-muted-foreground text-sm">
          You voted for{' '}
          <strong className="text-gold-400">{lanternName}</strong>
        </p>
        <p className="text-muted-foreground text-xs mt-2">
          May the best lantern win! ✨
        </p>
      </motion.div>
    </motion.div>
  )
}
