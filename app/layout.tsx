import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '../lib/query-provider'
import { Toaster } from '../components/ui/toaster'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern Matrimoney - Financial Literacy for Couples',
  description: 'Transform money stress into shared success with our comprehensive e-book & workbook—designed to help couples master their finances, together.',
  keywords: 'financial literacy, couples finance, money management, relationship finance, financial planning',
  authors: [{ name: 'Modern Matrimoney' }],
  openGraph: {
    title: 'Modern Matrimoney - Financial Literacy for Couples',
    description: 'Transform money stress into shared success with our comprehensive e-book & workbook—designed to help couples master their finances, together.',
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
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
