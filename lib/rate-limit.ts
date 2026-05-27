import { createServiceClient } from './supabase/server'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

/**
 * Simple rate limiter using Supabase.
 * Allows max `limit` requests per `windowMs` milliseconds.
 */
export async function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000
): Promise<RateLimitResult> {
  const supabase = createServiceClient()
  const windowStart = new Date(Date.now() - windowMs).toISOString()
  const resetAt = new Date(Date.now() + windowMs)

  try {
    // Count recent requests from this key
    const { count, error } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('key', key)
      .gte('created_at', windowStart)

    if (error) {
      console.error('Rate limit check error:', error)
      return { allowed: true, remaining: limit, resetAt }
    }

    const current = count ?? 0

    if (current >= limit) {
      return { allowed: false, remaining: 0, resetAt }
    }

    // Record this request
    await supabase.from('rate_limits').insert({ key })

    // Clean up old entries (best-effort)
    supabase
      .from('rate_limits')
      .delete()
      .lt('created_at', windowStart)
      .then(() => {}) // fire-and-forget

    return { allowed: true, remaining: limit - current - 1, resetAt }
  } catch (err) {
    console.error('Rate limiter exception:', err)
    return { allowed: true, remaining: limit, resetAt }
  }
}
