'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, TrendingUp, Shield, Target, Menu, X, Home, BookOpen, Heart, Users, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/lib/hooks/use-toast'

function FloatingMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
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
              href="/shop"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Shop
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

export default function ProfessionalSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firm: '',
    phone: '',
    specialty: '',
    experience: '',
    clientBase: '',
    interests: '',
    website: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/professionals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          firm: formData.firm,
          phone: formData.phone,
          specialty: formData.specialty
        }),
      })

      if (response.ok) {
        toast({
          title: "Application Submitted!",
          description: "Thank you for your interest. We'll be in touch soon.",
        })
        setFormData({
          name: '',
          email: '',
          firm: '',
          phone: '',
          specialty: '',
          experience: '',
          clientBase: '',
          interests: '',
          website: ''
        })
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth-gray py-8 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
      <FloatingMenu />
      <div className="max-w-4xl mx-auto px-gutter-mobile md:px-gutter-desktop">
        <div className="text-center mb-8">
          <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-teal-900 mb-4 font-heading">
                Financial Professionals: Join Our Pilot Program
              </h1>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-4 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <p className="text-base text-gray-800 max-w-3xl mx-auto leading-relaxed">
                Help shape the future of couples&apos; financial coaching. Get exclusive access to our professional tools and training materials.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Benefits Section */}
          <div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-teal flex items-center justify-center shadow-md icon-wrapper">
                    <Shield className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-teal-900 font-heading">
                    Program Benefits
                  </h3>
                </div>
                <p className="text-sm text-gray-800 mb-4">
                  As a pilot program member, you&apos;ll receive:
                </p>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-4 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <div className="space-y-3">
                  {[
                    "Licensing or white-label access to the book and workbook",
                    "Coaching and client-facing tools",
                    "A certification path to become a Matrimoney Coach",
                    "Speaking and workshop opportunities",
                    "Marketing assets and branding support",
                    "Early access to upcoming tools and training",
                    "A private network of aligned professionals"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-teal flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-sm text-gray-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Collaborators Section */}
          <div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gold-light flex items-center justify-center shadow-md icon-wrapper">
                    <Target className="w-6 h-6 text-neutral-dark" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-teal-900">
                    Ideal Collaborators
                  </h3>
                </div>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-4 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <div className="space-y-2">
                  <p className="text-sm text-gray-800">• Financial planners and advisors</p>
                  <p className="text-sm text-gray-800">• Insurance specialists</p>
                  <p className="text-sm text-gray-800">• CPAs and tax professionals</p>
                  <p className="text-sm text-gray-800">• Estate planning attorneys</p>
                  <p className="text-sm text-gray-800">• Therapists and licensed counselors</p>
                  <p className="text-sm text-gray-800">• Relationship and executive coaches</p>
                  <p className="text-sm text-gray-800">• Pastors, clergy, and values-based leaders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <h3 className="text-2xl font-bold text-teal-900 font-heading mb-2">
                Apply to Join
              </h3>
              <p className="text-base text-gray-800">
                Tell us about yourself and your practice:
              </p>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-800 font-body">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 input-focus bg-white/50"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-800 font-body">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 input-focus bg-white/50"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <Label htmlFor="firm" className="text-sm font-medium text-gray-800 font-body">
                      Firm or Organization *
                    </Label>
                    <Input
                      id="firm"
                      name="firm"
                      type="text"
                      required
                      value={formData.firm}
                      onChange={handleInputChange}
                      className="mt-1 input-focus bg-white/50"
                      placeholder="Smith Financial Planning"
                    />
                  </div>
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-800 font-body">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 input-focus bg-white/50"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                  <Label htmlFor="specialty" className="text-sm font-medium text-gray-800 font-body">
                    Profession *
                  </Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="mt-1 input-focus bg-white/50"
                    placeholder="Financial Planning, Marriage Therapy, etc."
                  />
                </div>

                <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-800 font-body">
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1 input-focus bg-white/50"
                    placeholder="5+ years"
                  />
                </div>

                <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                  <Label htmlFor="clientBase" className="text-sm font-medium text-gray-800 font-body">
                    Current Client Base?
                  </Label>
                  <Textarea
                    id="clientBase"
                    name="clientBase"
                    value={formData.clientBase}
                    onChange={handleInputChange}
                    className="mt-1 input-focus bg-white/50"
                    placeholder="Couples, individuals, specific communities, etc."
                    rows={3}
                  />
                </div>

                <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                  <Label htmlFor="interests" className="text-sm font-medium text-gray-800 font-body">
                    How do you envision integrating Modern Matrimoney into your work?
                  </Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="mt-1 input-focus bg-white/50"
                    placeholder="Tell us how you'd use the tools, coaching, or materials in your practice."
                    rows={3}
                  />
                </div>

                <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-800 font-body">
                    Website or LinkedIn (optional)
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    className="mt-1 input-focus bg-white/50"
                    placeholder="https://..."
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary btn-glow py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button className="bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 btn-glow">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
