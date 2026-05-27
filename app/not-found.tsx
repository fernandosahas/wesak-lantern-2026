import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl mb-6">🏮</span>
      <h1 className="font-display text-4xl font-bold gold-text mb-3">Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-gold px-6 py-3 rounded-full font-semibold text-black"
      >
        Return Home
      </Link>
    </div>
  )
}
