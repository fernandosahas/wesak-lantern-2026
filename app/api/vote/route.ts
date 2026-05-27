import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { hashIP, getClientIP, validateTurnstile } from '@/lib/utils'
import { rateLimit } from '@/lib/rate-limit'
import { sendSuspiciousActivityAlert } from '@/lib/resend'
import type { VoteRequest } from '@/types'
import { z } from 'zod'

const voteSchema = z.object({
  lantern_id: z.string().uuid('Invalid lantern ID'),
  turnstile_token: z.string().min(1, 'CAPTCHA token required'),
  fingerprint: z.string().min(10, 'Invalid fingerprint'),
  device_hash: z.string().min(8, 'Invalid device hash'),
})

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  const ipHash = hashIP(ip)

  // ── 1. Rate limiting ─────────────────────────────────────────────
  const rl = await rateLimit(`vote:${ipHash}`, 3, 60_000) // 3 votes per minute max
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a moment.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60',
        },
      }
    )
  }

  // ── 2. Parse & validate body ─────────────────────────────────────
  let body: VoteRequest
  try {
    const raw = await request.json()
    body = voteSchema.parse(raw)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const { lantern_id, turnstile_token, fingerprint, device_hash } = body

  // ── 3. Validate Turnstile CAPTCHA ────────────────────────────────
  const captchaValid = await validateTurnstile(turnstile_token, ip)
  if (!captchaValid) {
    return NextResponse.json(
      { success: false, error: 'CAPTCHA verification failed. Please try again.' },
      { status: 403 }
    )
  }

  const supabase = createServiceClient()

  // ── 4. Check voting is enabled ───────────────────────────────────
  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('voting_enabled, voting_start, voting_end')
    .single()

  if (settingsError || !settings) {
    return NextResponse.json(
      { success: false, error: 'Unable to check voting status.' },
      { status: 503 }
    )
  }

  if (!settings.voting_enabled) {
    return NextResponse.json(
      { success: false, error: 'Voting is not currently open.' },
      { status: 403 }
    )
  }

  // Check voting window
  const now = new Date()
  if (settings.voting_start && new Date(settings.voting_start) > now) {
    return NextResponse.json(
      { success: false, error: 'Voting has not started yet.' },
      { status: 403 }
    )
  }
  if (settings.voting_end && new Date(settings.voting_end) < now) {
    return NextResponse.json(
      { success: false, error: 'Voting has ended.' },
      { status: 403 }
    )
  }

  // ── 5. Check lantern exists ──────────────────────────────────────
  const { data: lantern, error: lanternError } = await supabase
    .from('lanterns')
    .select('id, name')
    .eq('id', lantern_id)
    .single()

  if (lanternError || !lantern) {
    return NextResponse.json(
      { success: false, error: 'Lantern not found.' },
      { status: 404 }
    )
  }

  // ── 6. Duplicate vote detection (IP, device, fingerprint) ────────
  const [ipCheck, deviceCheck, fpCheck] = await Promise.all([
    supabase.from('votes').select('id').eq('ip_hash', ipHash).limit(1),
    supabase.from('votes').select('id').eq('device_hash', device_hash).limit(1),
    supabase.from('votes').select('id').eq('fingerprint', fingerprint).limit(1),
  ])

  if (ipCheck.data && ipCheck.data.length > 0) {
    return NextResponse.json(
      { success: false, error: 'You have already voted from this network.' },
      { status: 409 }
    )
  }

  if (deviceCheck.data && deviceCheck.data.length > 0) {
    return NextResponse.json(
      { success: false, error: 'You have already voted from this device.' },
      { status: 409 }
    )
  }

  if (fpCheck.data && fpCheck.data.length > 0) {
    // Send suspicious activity alert (same fingerprint, different IP)
    await sendSuspiciousActivityAlert({
      ip_hash: ipHash,
      fingerprint,
      lantern_id,
      reason: 'Duplicate fingerprint detected',
    }).catch(() => {})

    return NextResponse.json(
      { success: false, error: 'You have already voted from this browser.' },
      { status: 409 }
    )
  }

  // ── 7. Insert vote (transaction-safe) ────────────────────────────
  const { error: insertError } = await supabase.from('votes').insert({
    lantern_id,
    ip_hash: ipHash,
    device_hash,
    fingerprint,
  })

  if (insertError) {
    // Unique constraint violation = duplicate
    if (insertError.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'You have already voted.' },
        { status: 409 }
      )
    }
    console.error('Vote insert error:', insertError)
    return NextResponse.json(
      { success: false, error: 'Failed to record your vote. Please try again.' },
      { status: 500 }
    )
  }

  // ── 8. Increment vote count ──────────────────────────────────────
  const { error: updateError } = await supabase.rpc('increment_vote_count', {
    p_lantern_id: lantern_id,
  })

  if (updateError) {
    console.error('Vote count increment error:', updateError)
    // Vote was recorded; count discrepancy is non-fatal
  }

  // ── 9. Log the action ────────────────────────────────────────────
  await supabase.from('admin_logs').insert({
    action: 'VOTE_CAST',
    details: {
      lantern_id,
      lantern_name: lantern.name,
      ip_hash: ipHash,
    },
  })

  // ── 10. Return success ───────────────────────────────────────────
  const { data: updated } = await supabase
    .from('lanterns')
    .select('vote_count')
    .eq('id', lantern_id)
    .single()

  return NextResponse.json({
    success: true,
    message: 'Vote cast successfully! 🏮',
    data: {
      lantern_id,
      new_vote_count: updated?.vote_count ?? 0,
    },
  })
}
