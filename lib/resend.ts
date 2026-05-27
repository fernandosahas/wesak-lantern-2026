import { Resend } from 'resend'

type SuspiciousActivityAlert = {
  ip_hash: string
  fingerprint: string
  lantern_id: string
  reason: string
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  return apiKey ? new Resend(apiKey) : null
}

export async function sendSuspiciousActivityAlert(alert: SuspiciousActivityAlert) {
  const resend = getResendClient()
  const from = process.env.RESEND_FROM_EMAIL
  const to = process.env.ADMIN_EMAIL

  if (!resend || !from || !to) {
    console.warn('Resend alert skipped: email environment variables are not configured.')
    return
  }

  await resend.emails.send({
    from,
    to,
    subject: 'Suspicious voting activity detected',
    text: [
      `Reason: ${alert.reason}`,
      `Lantern ID: ${alert.lantern_id}`,
      `IP hash: ${alert.ip_hash}`,
      `Fingerprint: ${alert.fingerprint}`,
    ].join('\n'),
  })
}
