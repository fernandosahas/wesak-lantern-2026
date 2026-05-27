import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Noto_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wesak2026.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Wesak Lantern Competition 2026 | B/Badulla Central College',
    template: '%s | Wesak Lantern Competition 2026',
  },
  description:
    'Vote for your favourite Wesak lantern at the B/Badulla Central College Wesak Lantern Competition 2026. 12 beautiful handcrafted lanterns competing for glory.',
  keywords: [
    'Wesak',
    'lantern competition',
    'Badulla Central College',
    'Sri Lanka',
    'Buddhist',
    'vote',
    '2026',
  ],
  authors: [{ name: 'B/Badulla Central College' }],
  creator: 'B/Badulla Central College',
  openGraph: {
    title: 'Wesak Lantern Competition 2026 | B/Badulla Central College',
    description:
      'Vote for your favourite Wesak lantern. 12 handcrafted lanterns competing for glory.',
    url: siteUrl,
    siteName: 'Wesak Lantern Competition 2026',
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: 'Wesak Lantern Competition 2026',
      },
    ],
    locale: 'en_LK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wesak Lantern Competition 2026',
    description: 'Vote for your favourite Wesak lantern!',
    images: [`${siteUrl}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", notoSans.variable, playfairDisplayHeading.variable)} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 15, 25, 0.95)',
              color: '#fbbf24',
              border: '1px solid rgba(245,158,11,0.3)',
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#f59e0b', secondary: '#0a0a0f' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
