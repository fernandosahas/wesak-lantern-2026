'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#vote', label: 'Vote' },
  { href: '#leaderboard', label: 'Leaderboard' },
  { href: '#rules', label: 'Rules' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong py-2.5 sm:py-3' : 'py-3 sm:py-5 bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2.5 group">
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-gold-500/30 bg-background/70 shadow-[0_0_18px_rgba(245,158,11,0.18)] transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
              <Image
                src="/school-logo.png"
                alt="B/Badulla Central College logo"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="max-w-[190px] truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:max-w-none sm:text-xs">
                B/Badulla Central College
              </p>
              <p className="font-display text-sm font-bold gold-text sm:text-base">
                ශාක්‍යමුණි 2026
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-gold-400 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <Link
              href="#vote"
              className="btn-gold px-5 py-2 rounded-full text-sm font-semibold text-black"
            >
              Vote Now 🏮
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-gold-500/10 hover:text-gold-400"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-3 space-y-1 border-t border-border/50 pb-2 pt-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl px-3 py-3.5 text-base font-medium text-muted-foreground transition-colors hover:bg-gold-500/10 hover:text-gold-400"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="#vote"
                  className="mt-4 block rounded-xl btn-gold px-5 py-3.5 text-center text-base font-semibold text-black"
                  onClick={() => setIsOpen(false)}
                >
                  Vote Now 🏮
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
