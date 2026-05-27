import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Wesak Lantern Competition 2026'
  const subtitle = searchParams.get('subtitle') || 'B/Badulla Central College · Vote Now'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f20 50%, #0a0a1a 100%)',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Lantern emoji */}
        <div style={{ fontSize: 80, marginBottom: 24 }}>🏮</div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f59e0b, #fcd34d, #d97706)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 900,
            padding: '0 40px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </div>

        {/* Bottom decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: 'rgba(245,158,11,0.6)',
            fontSize: 18,
          }}
        >
          <div style={{ width: 60, height: 1, background: 'rgba(245,158,11,0.4)' }} />
          B/Badulla Central College
          <div style={{ width: 60, height: 1, background: 'rgba(245,158,11,0.4)' }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
