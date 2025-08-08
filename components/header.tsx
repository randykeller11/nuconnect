'use client'

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-brand-teal shadow-sm border-b border-brand-teal/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gold-light transition-colors duration-200 p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
              <div className="w-32 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <span className="text-white font-bold text-sm font-heading">Modern Matrimoney</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-64 bg-brand-teal border-t border-white/20 shadow-lg z-50">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/questionnaire"
                className="text-white hover:text-gold-light transition-colors duration-200 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Take Questionnaire
              </Link>
              
              <button
                onClick={() => {
                  // Trigger workbook popup
                  const event = new CustomEvent('openWorkbookDialog');
                  window.dispatchEvent(event);
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-gold-light transition-colors duration-200 py-2 border-b border-white/10 text-left"
              >
                Explore Workbook
              </button>
              
              <Link 
                href="/professional-signup"
                className="text-white hover:text-gold-light transition-colors duration-200 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Pilot Program
              </Link>
              
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-gold-light transition-colors duration-200 py-2 text-left"
              >
                Contact Us
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
