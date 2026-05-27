import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { timeAgo } from '@/lib/utils'
import type { AdminLog } from '@/types'

export const metadata: Metadata = { title: 'Activity Logs' }
export const dynamic = 'force-dynamic'
export const revalidate = 15

const actionLabels: Record<string, { label: string; color: string }> = {
  VOTE_CAST: { label: 'Vote Cast', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  LANTERN_CREATED: { label: 'Lantern Added', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  LANTERN_UPDATED: { label: 'Lantern Updated', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  LANTERN_DELETED: { label: 'Lantern Deleted', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  SETTINGS_UPDATED: { label: 'Settings Changed', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  VOTES_EXPORTED: { label: 'CSV Exported', color: 'text-gold-500 bg-gold-500/10 border-gold-500/20' },
}

export default async function LogsPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('admin_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  const logs = (data ?? []) as AdminLog[]

  return (
    <div className="space-y-8 pt-16 md:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold gold-text">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Full audit trail of system events</p>
      </div>

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <p className="text-muted-foreground text-sm">{logs?.length ?? 0} entries</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-muted-foreground text-xs">Live</span>
          </div>
        </div>

        <div className="divide-y divide-border/50 max-h-[70vh] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No activity yet</p>
            </div>
          ) : logs.map((log) => {
            const meta = actionLabels[log.action] ?? { label: log.action, color: 'text-muted-foreground bg-secondary border-border' }
            const details = log.details as Record<string, unknown> | null
            const detailText = details
              ? String(details.name ?? details.lantern_name ?? (details.count !== undefined ? `${details.count} records` : JSON.stringify(details)))
              : null
            return (
              <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-secondary/20 transition-colors">
                <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg border whitespace-nowrap ${meta.color}`}>
                  {meta.label}
                </span>
                <div className="flex-1 min-w-0">
                  {detailText && (
                    <p className="text-foreground text-sm truncate">
                      {detailText}
                    </p>
                  )}
                  {details?.ip_hash !== undefined && (
                    <p className="text-muted-foreground text-xs font-mono">
                      IP: {String(details.ip_hash).slice(0, 16)}…
                    </p>
                  )}
                </div>
                <p className="flex-shrink-0 text-muted-foreground text-xs">{timeAgo(log.created_at)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
