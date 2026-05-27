import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { CountdownTimer } from '@/components/countdown-timer'
import { LanternGrid } from '@/components/lantern-grid'
import { Leaderboard } from '@/components/leaderboard'
import { RulesSection } from '@/components/rules-section'
import { Footer } from '@/components/footer'
import { LanternGridSkeleton } from '@/components/skeletons'
import type { Lantern, Settings } from '@/types'

export const metadata: Metadata = {
  title: 'Home | Wesak Lantern Competition 2026',
}

export const revalidate = 30 // revalidate every 30 seconds

async function getLandingData(): Promise<{ lanterns: Lantern[]; settings: Settings | null }> {
  const supabase = createPublicClient()

  const [{ data: lanterns }, { data: settings }] = await Promise.all([
    supabase
      .from('lanterns')
      .select('*')
      .order('vote_count', { ascending: false }),
    supabase
      .from('settings')
      .select('*')
      .single(),
  ])

  return {
    lanterns: (lanterns as Lantern[]) || [],
    settings: settings as Settings | null,
  }
}

export default async function HomePage() {
  const { lanterns, settings } = await getLandingData()

  const votingEnabled = settings?.voting_enabled ?? false
  const votingStart = settings?.voting_start ? new Date(settings.voting_start) : null
  const votingEnd = settings?.voting_end ? new Date(settings.voting_end) : null

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background particles - rendered client side */}
      <Navigation />

      <main>
        {/* Hero */}
        <HeroSection
          votingEnabled={votingEnabled}
          lanternCount={lanterns.length}
        />

        {/* Countdown */}
        {votingStart && !votingEnabled && (
          <section className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold gold-text mb-8">
                Voting Opens In
              </h2>
              <CountdownTimer targetDate={votingStart} />
            </div>
          </section>
        )}

        {/* Lantern Gallery */}
        <section id="vote" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
                🏮 The Competitors
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                This Year's{' '}
                <span className="gold-text">Lanterns</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                12 beautifully handcrafted Wesak lanterns, each representing the creativity
                and devotion of our student teams.
              </p>
            </div>

            <Suspense fallback={<LanternGridSkeleton />}>
              <LanternGrid
                lanterns={lanterns}
                votingEnabled={votingEnabled}
                votingEnd={votingEnd?.toISOString() || null}
              />
            </Suspense>
          </div>
        </section>

        {/* Divider */}
        <div className="section-divider mx-8 my-4" />

        {/* Leaderboard */}
        <section id="leaderboard" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold-500 font-medium tracking-widest uppercase text-sm mb-3">
                📊 Live Rankings
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                Leaderboard
              </h2>
              <p className="text-muted-foreground text-lg">
                Real-time vote standings. Updates every 30 seconds.
              </p>
            </div>
            <Leaderboard lanterns={lanterns} />
          </div>
        </section>

        {/* Rules */}
        <section id="rules" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <RulesSection votingStart={votingStart} votingEnd={votingEnd} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
