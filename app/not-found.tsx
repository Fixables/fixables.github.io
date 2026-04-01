import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-sky-400 text-sm mb-4">404</p>
        <h1 className="text-4xl font-bold text-zinc-50 mb-4">Page Not Found</h1>
        <p className="text-zinc-400 mb-8">This page doesn&apos;t exist.</p>
        <Link href="/" className="text-sky-400 hover:text-sky-300 transition-colors">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}
