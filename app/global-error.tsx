'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-aulait">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg mb-6">
              <span className="text-2xl font-bold text-aulait">!</span>
            </div>
            <h1 className="text-3xl font-bold text-inkwell mb-4">Application Error</h1>
            <p className="text-lg text-lunar mb-8">
              A critical error occurred. Please try refreshing the page.
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
                  href="/"
                  className="text-lunar hover:text-inkwell underline"
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
