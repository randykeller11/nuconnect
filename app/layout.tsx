import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '../lib/query-provider'
import { ToastProvider } from '../lib/hooks/use-toast'
import { Toaster } from 'sonner'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NuConnect - Professional Networking',
  description: 'Connect with professionals and build meaningful business relationships through intelligent matching.',
  keywords: 'professional networking, business connections, AI matching, career development',
  authors: [{ name: 'NuConnect' }],
  openGraph: {
    title: 'NuConnect - Professional Networking',
    description: 'Connect with professionals and build meaningful business relationships through intelligent matching.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider>
            {children}
            <Toaster position="top-center" />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
