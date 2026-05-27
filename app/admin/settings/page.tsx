import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { VotingToggle } from '@/components/admin/voting-toggle'
import type { Settings } from '@/types'

export const metadata: Metadata = { title: 'Settings' }
export const revalidate = 0

export default async function SettingsPage() {
  const supabase = createServiceClient()
  const { data: settings } = await supabase.from('settings').select('*').single()

  return (
    <div className="space-y-8 pt-16 md:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage voting schedule and competition settings</p>
      </div>
      <VotingToggle settings={settings as Settings | null} />

      {/* Info card */}
      <div className="glass rounded-2xl p-6 border border-border">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">System Info</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Environment', value: process.env.NODE_ENV },
            { label: 'Supabase', value: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Connected' : '❌ Not configured' },
            { label: 'Cloudinary', value: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Connected' : '❌ Not configured' },
            { label: 'Turnstile', value: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ? '✅ Connected' : '⚠️ Using test key' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="text-foreground font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
