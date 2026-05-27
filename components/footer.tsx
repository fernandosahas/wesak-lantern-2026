import { Lamp } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Lamp className="h-6 w-6 text-gold-500" strokeWidth={1.5} />
            <div>
              <p className="font-display font-bold text-sm gold-text">Wesak Lantern Competition 2026</p>
              <p className="text-muted-foreground text-xs">B/Badulla Central College</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="#vote" className="text-muted-foreground hover:text-gold-400 text-sm transition-colors">
              Vote
            </Link>
            <Link href="#leaderboard" className="text-muted-foreground hover:text-gold-400 text-sm transition-colors">
              Leaderboard
            </Link>
            <Link href="#rules" className="text-muted-foreground hover:text-gold-400 text-sm transition-colors">
              Rules
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-xs text-center">
            © 2026 B/Badulla Central College. All rights reserved.
          </p>
        </div>

        <div className="section-divider my-6" />

        <p className="text-center text-muted-foreground text-xs">
          🏮 May the light of Wesak illuminate our hearts and guide us to wisdom. 🙏
        </p>
      </div>
    </footer>
  )
}
