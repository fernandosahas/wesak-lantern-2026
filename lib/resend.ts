import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@wesak2026.lk'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@wesak2026.lk'

/**
 * Notify admin of suspicious voting activity.
 */
export async function sendSuspiciousActivityAlert(details: {
  ip_hash: string
  fingerprint: string
  lantern_id: string
  reason: string
}) {
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: '⚠️ Suspicious Voting Activity Detected - Wesak 2026',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #dc2626;">⚠️ Suspicious Activity Detected</h2>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}</p>
        <p><strong>IP Hash:</strong> ${details.ip_hash}</p>
        <p><strong>Fingerprint:</strong> ${details.fingerprint}</p>
        <p><strong>Target Lantern:</strong> ${details.lantern_id}</p>
        <p><strong>Reason:</strong> ${details.reason}</p>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">
          B/Badulla Central College Wesak Lantern Competition 2026
        </p>
      </div>
    `,
  })
}

/**
 * Send vote confirmation email (optional feature).
 */
export async function sendVoteConfirmation(email: string, lanternName: string) {
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: '🏮 Your Vote Has Been Recorded - Wesak 2026',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0f; color: #fff;">
        <h1 style="color: #f59e0b; text-align: center;">🏮 Thank You for Voting!</h1>
        <p style="text-align: center; color: #d1d5db;">
          Your vote for <strong style="color: #f59e0b;">${lanternName}</strong> has been recorded.
        </p>
        <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 32px;">
          B/Badulla Central College<br>Wesak Lantern Competition 2026
        </p>
      </div>
    `,
  })
}
