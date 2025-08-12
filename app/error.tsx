'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-aulait flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg mb-6">
          <span className="text-2xl font-bold text-aulait">!</span>
        </div>
        <h1 className="text-3xl font-bold text-inkwell mb-4">Something went wrong</h1>
        <p className="text-lg text-lunar mb-8">
          An error occurred while loading this page.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block bg-inkwell text-aulait px-6 py-3 rounded-xl hover:bg-lunar transition-colors"
          >
            Try again
          </button>
          <div>
            <a
              href="/home"
              className="text-lunar hover:text-inkwell underline"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
