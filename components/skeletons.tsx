export function LanternGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden border border-border">
          <div className="aspect-[4/3] skeleton" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-5 rounded-lg w-3/4" />
            <div className="skeleton h-3 rounded-lg w-1/2" />
            <div className="skeleton h-3 rounded-lg w-full" />
            <div className="skeleton h-3 rounded-lg w-4/5" />
            <div className="skeleton h-10 rounded-xl mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-4">
            <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 rounded w-1/2" />
              <div className="skeleton h-2 rounded w-full" />
            </div>
            <div className="skeleton h-6 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 border border-border space-y-3">
      <div className="skeleton h-4 rounded w-1/3" />
      <div className="skeleton h-8 rounded w-1/2" />
    </div>
  )
}
