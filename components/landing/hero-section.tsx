'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-teal hero-background hero-parallax">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-hero-gradient"></div>
      <div className="relative pt-0 pb-section-vertical-mobile md:pb-section-vertical-desktop px-gutter-mobile md:px-gutter-desktop">
        <div className="max-w-7xl mx-auto">
          {/* Logo centered on top of hero */}
          <div className="flex justify-center mb-1">
            <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
              <div className="logo-image" title="Modern Matrimoney"></div>
            </Link>
          </div>
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg mb-8 border border-white/30 accent-text">
              Financial Harmony for Couples
            </div>
            <h1 className="hero-title text-white mb-8 max-w-4xl mx-auto">
              Where love and legacy meet
            </h1>
            <p className="hero-subtitle text-white/90 mb-12 max-w-3xl mx-auto">
              Modern Matrimoney gives couples tools to stop circling the same conversations and start building something real—together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 w-full max-w-xs sm:max-w-none mx-auto px-4 sm:px-0">
              <Link href="/questionnaire" className="w-full sm:w-auto max-w-full">
                <Button className="btn-primary btn-glow px-1 xs:px-2 sm:px-8 py-3 sm:py-4 text-xs xs:text-sm sm:text-lg font-semibold shadow-md transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-105 w-full sm:w-auto text-center min-w-0 max-w-full overflow-hidden text-ellipsis">
                  Take the Free Questionnaire
                </Button>
              </Link>
              <Link href="/shop" className="w-full sm:w-auto max-w-full">
                <Button className="bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 btn-glow px-1 xs:px-2 sm:px-8 py-3 sm:py-4 text-xs xs:text-sm sm:text-lg font-semibold w-full sm:w-auto text-center min-w-0 max-w-full overflow-hidden text-ellipsis">
                  Explore the Workbook
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
