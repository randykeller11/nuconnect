export default function NotFound() {
  return (
    <div className="min-h-screen bg-aulait flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg mb-6">
          <span className="text-2xl font-bold text-aulait">404</span>
        </div>
        <h1 className="text-3xl font-bold text-inkwell mb-4">Page Not Found</h1>
        <p className="text-lg text-lunar mb-8">
          We couldn't find the page you're looking for. It may have been moved or doesn't exist.
        </p>
        <div className="space-y-4">
          <a
            href="/home"
            className="inline-block bg-inkwell text-aulait px-6 py-3 rounded-xl hover:bg-lunar transition-colors"
          >
            Go to Home
          </a>
          <div>
            <a
              href="/auth"
              className="text-lunar hover:text-inkwell underline"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
