'use client'

import { useRouter } from 'next/navigation'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Users, Brain, Network } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm matches you with professionals based on shared interests, career goals, and mentorship preferences.'
    },
    {
      icon: Network,
      title: 'Networking Events',
      description: 'Join curated networking events and match rooms to connect with like-minded professionals in your industry.'
    },
    {
      icon: Users,
      title: 'Meaningful Connections',
      description: 'Build lasting professional relationships through mutual contact sharing and personalized connection notes.'
    }
  ]

  return (
    <div className="min-h-screen bg-aulait">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-8 bg-inkwell rounded-full flex items-center justify-center shadow-xl">
            <span className="text-3xl font-bold text-aulait">N</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-inkwell mb-6 tracking-tight">
            NuConnect
          </h1>
          
          <p className="text-xl text-lunar mb-8 max-w-2xl mx-auto">
            AI-powered professional connections and networking platform
          </p>
          
          <p className="text-lg text-lunar/80 mb-12 max-w-3xl mx-auto">
            Connect with like-minded professionals, find mentors and co-founders, 
            and build meaningful business relationships through intelligent matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <PrimaryButton
              onClick={() => router.push('/login')}
              size="xl"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Get Started
            </PrimaryButton>
            
            <Button
              variant="outline"
              onClick={() => router.push('/rooms')}
              className="h-16 px-10 text-xl border-2 border-lunar text-lunar hover:bg-lunar hover:text-aulait rounded-2xl"
            >
              Explore Events
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-inkwell/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-inkwell" />
                  </div>
                  <h3 className="text-xl font-semibold text-inkwell mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-lunar">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default function HomePage() {
  return (
    <div className="min-h-screen bg-aulait flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg mb-6">
          <span className="text-2xl font-bold text-aulait">N</span>
        </div>
        <h1 className="text-3xl font-bold text-inkwell mb-4">Welcome to NuConnect</h1>
        <p className="text-lg text-lunar mb-8">
          Professional networking powered by AI matching
        </p>
        <div className="space-y-4">
          <a
            href="/auth"
            className="inline-block bg-inkwell text-aulait px-6 py-3 rounded-xl hover:bg-lunar transition-colors"
          >
            Get Started
          </a>
          <div>
            <a
              href="/demo-selection"
              className="text-lunar hover:text-inkwell underline"
            >
              Try Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
