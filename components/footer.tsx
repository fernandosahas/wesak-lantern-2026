import { Lamp } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <Lamp className="h-6 w-6 text-gold-500" strokeWidth={1.5} />
            <div>
              <p className="font-display text-sm font-bold gold-text">Wesak Lantern Competition 2026</p>
              <p className="text-xs text-muted-foreground">B/Badulla Central College</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#vote" className="text-sm text-muted-foreground transition-colors hover:text-gold-400">
              Vote
            </Link>
            <Link href="#leaderboard" className="text-sm text-muted-foreground transition-colors hover:text-gold-400">
              Leaderboard
            </Link>
            <Link href="#rules" className="text-sm text-muted-foreground transition-colors hover:text-gold-400">
              Rules
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            © 2026 B/Badulla Central College. All rights reserved.
          </p>
        </div>

        <div className="section-divider my-6" />

        <p className="text-center text-xs text-muted-foreground">
          May the light of Wesak illuminate our hearts and guide us to wisdom.
          Brewed and built by Sahas Fernando
        </p>
        <p className="mt-3 text-center text-xs font-medium text-gold-500/80">
          Brewed and built by Sahas Fernando
        </p>
      </div>
    </footer>
  )
}
