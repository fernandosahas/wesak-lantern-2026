import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { LanternManagementClient } from '@/components/admin/lantern-management-client'
import type { Lantern } from '@/types'

export const metadata: Metadata = { title: 'Manage Lanterns' }
export const revalidate = 0

export default async function AdminLanternsPage() {
  const supabase = createServiceClient()
  const { data: lanterns } = await supabase
    .from('lanterns')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-8 pt-16 md:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Manage Lanterns</h1>
        <p className="text-muted-foreground mt-1">
          Add, edit, or remove lanterns from the competition.
        </p>
      </div>
      <LanternManagementClient initialLanterns={(lanterns as Lantern[]) || []} />
    </div>
  )
}
