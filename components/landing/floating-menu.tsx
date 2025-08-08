'use client'

import { useState } from 'react'
import { BookOpen, Users, Heart, MessageCircle, Menu, X, Home } from 'lucide-react'
import Link from 'next/link'

interface FloatingMenuProps {
  isQuestionnairePage?: boolean
}

export function FloatingMenu({ isQuestionnairePage = false }: FloatingMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }


  return (
    <div className="fixed top-6 left-6 z-50">
      {/* Menu Button */}
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

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 overflow-hidden">
          <nav className="py-2">
            {isQuestionnairePage ? (
              <Link 
                href="/"
                className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
            ) : (
              <Link 
                href="/questionnaire"
                className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5 mr-3" />
                Take Questionnaire
              </Link>
            )}
            
            <Link 
              href="/shop"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Shop
            </Link>
            
            <Link 
              href="/professional-signup"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-5 w-5 mr-3" />
              Join Pilot Program
            </Link>
            
            {!isQuestionnairePage && (
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 text-left"
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Contact Us
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
