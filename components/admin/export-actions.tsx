'use client'

import { Download, FileSpreadsheet } from 'lucide-react'

export function ExportActions() {
  return (
    <div className="glass rounded-2xl border border-border p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/10 text-gold-500">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Export Sheets</h2>
            <p className="text-sm text-muted-foreground">
              Download vote data for records and result announcements.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href="/api/admin/export?type=summary"
            className="inline-flex items-center justify-center gap-2 rounded-xl btn-gold px-4 py-2.5 text-sm font-semibold text-black"
          >
            <Download className="h-4 w-4" />
            Lantern Vote Summary
          </a>
          <a
            href="/api/admin/export"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border glass px-4 py-2.5 text-sm font-semibold text-gold-400 transition-colors hover:bg-gold-500/10"
          >
            <Download className="h-4 w-4" />
            Full Vote Log
          </a>
        </div>
      </div>
    </div>
  )
}
