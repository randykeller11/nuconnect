/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@supabase/supabase-js']
}

module.exports = nextConfig
