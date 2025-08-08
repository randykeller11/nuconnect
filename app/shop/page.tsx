'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, ExternalLink, Menu, X, Home, Heart, Users, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function FloatingMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }


  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        onClick={toggleMenu}
        className="w-14 h-14 bg-brand-teal/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 text-white hover:bg-brand-teal transition-all duration-200 flex items-center justify-center hover:scale-105"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 overflow-hidden">
          <nav className="py-2">
            <Link 
              href="/"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
            
            <Link 
              href="/questionnaire"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-5 w-5 mr-3" />
              Take Questionnaire
            </Link>
            
            <Link 
              href="/professional-signup"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-5 w-5 mr-3" />
              Join Pilot Program
            </Link>

            <button
              onClick={() => {
                window.location.href = '/#contact'
                setIsMenuOpen(false)
              }}
              className="w-full flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 text-left"
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Contact Us
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-earth-gray bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
      <FloatingMenu />
      
      <div className="py-24 px-gutter-mobile md:px-gutter-desktop">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-12 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="max-w-6xl mx-auto relative">
                  {/* Background Visual Element */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
                    <div className="relative">
                      <div className="w-64 h-64 bg-gradient-to-br from-brand-teal/20 to-gold-light/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <div className="w-48 h-48 bg-gradient-to-br from-brand-teal/30 to-gold-light/30 rounded-full flex items-center justify-center">
                          <BookOpen className="w-24 h-24 text-brand-teal" strokeWidth={1.5} />
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gold-light/40 rounded-full"></div>
                      <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-brand-teal/30 rounded-full"></div>
                      <div className="absolute top-1/2 -left-8 w-6 h-6 bg-gold-dark/50 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Centered Content */}
                  <div className="text-center relative z-10 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="hidden sm:flex w-16 h-16 bg-brand-teal rounded-lg items-center justify-center shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>
                      <h1 className="text-4xl sm:text-5xl font-bold text-teal-900 font-heading">
                        Shop
                      </h1>
                    </div>
                    <p className="text-2xl text-gray-800 mb-6 leading-relaxed font-medium">
                      Welcome to our collection.
                    </p>
                    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                      This is where the journey becomes tangible.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Whether you&apos;re exploring new ways to align with your partner or looking for a resource to bring into your next conversation, everything here was created with care and purpose.
                    </p>
                  </div>
                  
                </div>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section - Call to Action */}
              <div className="px-8 py-8 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <div className="max-w-6xl mx-auto text-center">
                  <p className="text-lg text-gray-800 mb-6 leading-relaxed">
                    Ready to transform your relationship with money? Start with our carefully crafted resources.
                  </p>
                  <div className="flex justify-center">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                      <div className="w-full max-w-xs mx-auto sm:max-w-none sm:w-auto">
                        <Link href="/questionnaire" className="w-full sm:w-auto">
                          <Button className="btn-primary px-1 xs:px-2 sm:px-8 py-2 xs:py-3 text-xs xs:text-sm sm:text-lg font-semibold w-full sm:w-auto text-center leading-tight h-auto flex items-center justify-center">
                            <span className="block sm:hidden leading-tight">
                              Take Free<br />Questionnaire
                            </span>
                            <span className="hidden sm:block">
                              Take Free Questionnaire
                            </span>
                          </Button>
                        </Link>
                      </div>
                      <div className="w-full max-w-xs mx-auto sm:max-w-none sm:w-auto">
                        <Link href="/#contact" className="w-full sm:w-auto">
                          <Button className="bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 btn-glow px-8 py-3 text-lg font-semibold w-full sm:w-auto">
                            Contact Us
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Matrimoney eBook */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2 mb-12">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Book Cover Image */}
                <div className="lg:col-span-1 flex justify-center">
                  <Image 
                    src="/images/MatriMoneyCoverBook.jpg" 
                    alt="Modern Matrimoney eBook Cover"
                    width={300}
                    height={400}
                    className="w-full max-w-xs rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                
                {/* Book Content */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-teal-900 mb-4 font-heading">
                    Modern Matrimoney eBook
                  </h2>
                  <p className="text-lg text-brand-teal font-medium mb-6">
                    Exclusively on Amazon starting September 2
                  </p>
                  <p className="text-lg text-brand-teal font-medium mb-6">
                    Available on all major platforms December 1
                  </p>
                  <p className="text-lg text-gray-800 mb-8 leading-relaxed">
                    This book was written to help couples reflect, reconnect, and move forward with clarity. Each chapter invites conversation, thought, and the kind of pause that leads to progress.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <div className="flex justify-center">
                <Button
                  onClick={() => window.open('http://dl.bookfunnel.com/xdqncruo39', '_blank')}
                  className="btn-primary flex items-center gap-2 justify-center px-8 py-3 text-lg font-semibold"
                >
                  Order Here
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Companion Worksheet */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2 mb-12">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Workbook Cover Image */}
                <div className="lg:col-span-1 flex justify-center">
                  <Image 
                    src="/images/MatriMoneyCoverWorkbook.jpg" 
                    alt="Modern Matrimoney Workbook Cover"
                    width={300}
                    height={400}
                    className="w-full max-w-xs rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                
                {/* Workbook Content */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-teal-900 mb-4 font-heading">
                    Companion Worksheet
                  </h2>
                  <p className="text-lg text-brand-teal font-medium mb-6">
                    Coming soon.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <p className="text-lg text-gray-800 leading-relaxed">
                A guided space to write, circle, and revisit what matters most. Designed to complement the eBook and support meaningful conversations at your own pace.
              </p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <h3 className="text-2xl font-bold text-teal-900 mb-4 font-heading">
                More to Come
              </h3>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <p className="text-lg text-gray-800 mb-4 leading-relaxed">
                More tools are on the way.
              </p>
              <p className="text-lg text-gray-800 mb-4 leading-relaxed">
                We&apos;re building intentionally, with the goal of offering practical support for couples in every season.
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                Whether you&apos;re starting here or returning later, we&apos;re glad you found your way.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button className="bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 btn-glow">
                ← Back to Home
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
