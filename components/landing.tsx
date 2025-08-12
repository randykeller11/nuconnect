'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, TrendingUp, Heart, Shield, Target, CheckCircle, Star, ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// Removed missing imports - these components don't exist
// import { FloatingMenu } from './landing/floating-menu'
// import { HeroSection } from './landing/hero-section'
// import { ContactForm } from './landing/contact-form'

// Simple placeholder components
const FloatingMenu = () => <div />
const HeroSection = () => (
  <section className="py-24 relative hero-background hero-parallax">
    <div className="absolute inset-0 bg-black/40"></div>
    <div className="absolute inset-0 bg-hero-gradient"></div>
    <div className="relative max-w-7xl mx-auto px-4 text-center">
      <h1 className="text-5xl font-bold text-white mb-8">Welcome to NuConnect</h1>
      <p className="text-xl text-white/90 mb-8">Professional networking reimagined</p>
    </div>
  </section>
)
const ContactForm = () => (
  <form className="space-y-4">
    <input type="email" placeholder="Your email" className="w-full p-3 rounded-lg border" />
    <textarea placeholder="Your message" className="w-full p-3 rounded-lg border h-32"></textarea>
    <button type="submit" className="bg-brand-teal text-white px-6 py-3 rounded-lg">Send Message</button>
  </form>
)

export default function Landing(): React.JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.scroll-fade-in')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <FloatingMenu />
      <HeroSection />

      {/* This Is Not Just About Money */}
      <section id="why-not-just-money" className="pt-24 pb-8 relative bg-cover bg-center bg-no-repeat hero-background hero-parallax" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="text-center mb-6 scroll-fade-in">
            <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="w-12 h-12 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                  <Heart className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading">
                  This Is Not Just About Money
                </h2>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                  Most couples name money as their top source of stress.
                </p>
                <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                  But the real issue is often deeper. It&apos;s the silence, the avoidance, or the lack of alignment.
                </p>
                <p className="text-base text-brand-teal font-medium font-body">
                  Modern Matrimoney helps couples reconnect, plan with intention, and protect what they are building.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Stand For */}
      <section id="what-we-stand-for" className="py-24 relative bg-cover bg-center bg-no-repeat hero-background hero-parallax" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="text-center mb-6 scroll-fade-in">
            <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="w-12 h-12 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                  <Shield className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading">
                  What We Stand For
                </h2>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                  You don&apos;t need a perfect plan to get started.
                </p>
                <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                  You need space to talk honestly, a strategy that fits your life, and tools that work for both of you.
                </p>
                <p className="text-base text-brand-teal font-medium font-body">
                  This is part workbook, part conversation guide, and part reminder that your relationship is worth the effort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It Is For */}
      <section id="who-its-for" className="py-24 relative hero-background hero-parallax">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-hero-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="text-center mb-12 scroll-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-teal to-brand-teal/80 rounded-2xl flex items-center justify-center shadow-2xl">
              <Users className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-8 text-shadow-lg">
              Who It Is For
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-gold-light to-gold-dark mx-auto mb-8 rounded-full shadow-lg"></div>
            <p className="font-body text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              This is for couples who are ready to transform their relationship with money
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-black/50">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-brand-teal/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-brand-teal/30">
                    <Heart className="w-7 h-7 text-brand-teal" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white mb-3">Growing Apart</h3>
                    <p className="font-body text-white/80 leading-relaxed">Are growing but not always in the same direction</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-black/50">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gold-light/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-gold-light/30">
                    <Users className="w-7 h-7 text-gold-light" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white mb-3">Stuck in Loops</h3>
                    <p className="font-body text-white/80 leading-relaxed">Keep revisiting the same money conversations</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-black/50">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-brand-teal/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-brand-teal/30">
                    <Target className="w-7 h-7 text-brand-teal" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white mb-3">Seeking Clarity</h3>
                    <p className="font-body text-white/80 leading-relaxed">Want more connection and less confusion</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-black/50">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gold-light/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-gold-light/30">
                    <Shield className="w-7 h-7 text-gold-light" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white mb-3">Building Legacy</h3>
                    <p className="font-body text-white/80 leading-relaxed">Care about legacy as much as lifestyle</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-gold-light/10 to-gold-dark/10 backdrop-blur-lg rounded-2xl p-8 border border-gold-light/20">
                <p className="font-body text-xl text-white/90 font-medium leading-relaxed">
                  Whether you're building from scratch or recovering from strain, 
                  <span className="text-gold-light font-semibold"> this is for you.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try the Free Check-In */}
      <section id="free-checkin" className="pt-24 pb-8 relative bg-cover bg-center bg-no-repeat hero-background hero-parallax" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="text-center mb-6 scroll-fade-in">
            <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="w-12 h-12 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                  <CheckCircle className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading">
                  Try the Free Check-In
                </h2>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                  Start with a short, guided experience to help you pause, reflect, and reconnect.
                </p>
                <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                  You will walk away with one powerful question you can ask your partner tonight.
                </p>
                <p className="text-base text-brand-teal mb-8 font-medium font-body">
                  It is free, quick, and designed to bring clarity—not pressure.
                </p>
                <div className="w-full max-w-xs mx-auto sm:max-w-none">
                  <Button 
                    onClick={() => router.push('/questionnaire')}
                    className="btn-primary hover:scale-105 transition-all duration-300 shadow-lg w-full sm:w-auto px-1 xs:px-2 sm:px-6 text-xs xs:text-sm sm:text-lg min-w-0 max-w-full text-center leading-tight py-2 xs:py-3 h-auto flex items-center justify-center"
                  >
                    <span className="block xs:hidden leading-tight">
                      Take the Free<br />Questionnaire
                    </span>
                    <span className="hidden xs:block">
                      Take the Free Questionnaire
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Tools for Real Relationships */}
      <section id="real-tools" className="py-24 relative overflow-hidden bg-cover bg-center bg-no-repeat hero-background hero-parallax" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="text-center mb-6 scroll-fade-in">
            <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="w-12 h-12 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                  <Target className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading">
                  Real Tools for Real Relationships
                </h2>
                <p className="text-lg text-gray-800 mt-4 font-body leading-relaxed">
                  This isn&apos;t therapy. It isn&apos;t another budgeting app.
                </p>
                <p className="text-base text-brand-teal mt-2 font-medium font-body">
                  It&apos;s a framework to help you:
                </p>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-teal flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-gray-800 font-body">Clarify your shared priorities</p>
                    </div>
                  </div>
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-gray-800 font-body">Make decisions together with confidence</p>
                    </div>
                  </div>
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-teal flex items-center justify-center flex-shrink-0 shadow-sm">
                        <ArrowRight className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-gray-800 font-body">Break financial and emotional patterns that no longer serve you</p>
                    </div>
                  </div>
                  <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Star className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-gray-800 font-body">Create a future that reflects both of your values</p>
                    </div>
                  </div>
                </div>
                <Link href="/shop">
                  <Button className="bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 btn-glow">
                    Explore the Workbook
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Professional Section */}
      <section className="py-24 relative hero-background hero-parallax">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-hero-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 sm:p-12 text-white shadow-xl border border-white/10 scroll-fade-in">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h2 className="section-title-white mb-8">
                Financial Professionals: Join Our Pilot Program
              </h2>
              <p className="body-large mb-8 text-white/90">
                Help shape the future of couples' financial coaching. Get exclusive access to our professional tools and training materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/professional-signup">
                  <Button className="btn-primary btn-glow">
                    Apply to Join
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden bg-cover bg-center bg-no-repeat hero-background hero-parallax" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="text-center mb-6 scroll-fade-in">
            <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="w-12 h-12 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                  <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading">
                  What's Inside the E-book & Workbook
                </h2>
                <p className="text-lg text-gray-800 mt-4 font-body leading-relaxed max-w-3xl mx-auto">
                  Comprehensive tools and strategies designed specifically for couples.
                </p>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { text: "Communication frameworks for money conversations", icon: Users },
                    { text: "Goal-setting exercises for shared financial dreams", icon: Target },
                    { text: "Budgeting strategies that work for two people", icon: TrendingUp },
                    { text: "Debt elimination plans you can tackle together", icon: Shield },
                    { text: "Investment basics for couples starting out", icon: Star },
                    { text: "Emergency fund building techniques", icon: CheckCircle },
                    { text: "Planning for major life events and purchases", icon: Heart },
                    { text: "Retirement planning as a team", icon: ArrowRight }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    const isEven = index % 2 === 0;
                    return (
                      <div key={index} className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                            isEven ? 'bg-brand-teal' : 'bg-amber-500'
                          }`}>
                            <IconComponent className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                          <p className="text-gray-800 font-body">{feature.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative bg-cover bg-center bg-no-repeat hero-background hero-parallax" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="text-center mb-12 scroll-fade-in">
            <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
              {/* Header Section */}
              <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
                <div className="w-12 h-12 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                  <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading">
                  Contact Us
                </h2>
                <p className="text-lg text-gray-800 mt-4 font-body leading-relaxed">
                  Have questions about Modern Matrimoney? Want to learn more about our approach to couples' financial wellness? We'd love to hear from you.
                </p>
              </div>
              
              {/* Gold Divider */}
              <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
              
              {/* Body Section */}
              <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
                <div className="bg-white/60 rounded-xl p-6 shadow-lg border border-gray-200">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Connected */}
      <section id="stay-connected" className="py-24 relative hero-background hero-parallax">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-hero-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-gutter-mobile md:px-gutter-desktop text-center">
          <div className="scroll-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
              <Users className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-8 text-shadow-lg">
              Stay Connected
            </h2>
            <p className="font-body text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              We&apos;re building a long-term platform for couples who want more than surface-level advice.<br/>
              Join our community and get updates, tools, and prompts that support growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button className="btn-primary btn-glow">
                  Join the List
                </Button>
              </Link>
              <Button 
                onClick={() => router.push('/questionnaire')}
                className="bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 btn-glow"
              >
                Submit Your Story
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
