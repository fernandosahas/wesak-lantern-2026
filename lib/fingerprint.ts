'use client'

/**
 * Generates a privacy-preserving browser fingerprint.
 * This is used to detect duplicate votes across sessions.
 * No personally identifiable information is stored.
 */
export async function generateFingerprint(): Promise<string> {
  const components: string[] = []

  // Screen properties
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`)
  components.push(`${screen.availWidth}x${screen.availHeight}`)

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)

  // Language
  components.push(navigator.language)
  components.push(navigator.languages?.join(',') || '')

  // Platform
  components.push(navigator.platform || '')

  // Hardware concurrency
  components.push(String(navigator.hardwareConcurrency || 0))

  // Device memory (if available)
  components.push(String((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0))

  // Touch support
  components.push(String('ontouchstart' in window))

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 50
    const ctx = canvas.getContext('2d')!
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('Wesak 2026 🏮', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('Wesak 2026 🏮', 4, 17)
    components.push(canvas.toDataURL().slice(-50))
  } catch {
    components.push('no-canvas')
  }

  // WebGL renderer
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '')
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '')
      }
    }
  } catch {
    components.push('no-webgl')
  }

  // Fonts detection
  const testFonts = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana']
  const baseFonts = ['monospace', 'sans-serif', 'serif']
  const testString = 'mmmmmmmmmmlli'
  const testSize = '72px'
  const h = document.getElementsByTagName('body')[0]
  const s = document.createElement('span')
  s.style.fontSize = testSize
  s.innerHTML = testString
  const defaultWidths: Record<string, number> = {}

  for (const baseFont of baseFonts) {
    s.style.fontFamily = baseFont
    h.appendChild(s)
    defaultWidths[baseFont] = s.offsetWidth
    h.removeChild(s)
  }

  const detectedFonts: string[] = []
  for (const font of testFonts) {
    for (const baseFont of baseFonts) {
      s.style.fontFamily = `'${font}',${baseFont}`
      h.appendChild(s)
      if (s.offsetWidth !== defaultWidths[baseFont]) {
        detectedFonts.push(font)
      }
      h.removeChild(s)
    }
  }
  components.push(detectedFonts.join(','))

  // Hash everything together
  const raw = components.join('|||')
  const encoder = new TextEncoder()
  const data = encoder.encode(raw)

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    // Fallback: simple hash
    let hash = 0
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(32, '0')
  }
}

/** Generate device hash (more stable than fingerprint) */
export function generateDeviceHash(): string {
  const parts = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|')

  let hash = 0
  for (let i = 0; i < parts.length; i++) {
    const char = parts.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(16, '0')
}
