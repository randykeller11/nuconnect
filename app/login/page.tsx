'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrandHeader } from '@/components/BrandHeader'
import { FormCard } from '@/components/FormCard'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'

const INTERESTS_OPTIONS = [
  'AI', 'Climate', 'Fintech', 'Education', 'Health', 'Music', 
  'Art', 'Gaming', 'Marketing', 'Operations', 'Sales', 'Design', 
  'Product', 'Engineering'
]

const CAREER_GOALS_OPTIONS = [
  { value: 'find-cofounder', label: 'Find Co-founder' },
  { value: 'explore-jobs', label: 'Explore Jobs' },
  { value: 'hire', label: 'Hire Talent' },
  { value: 'learn-ai', label: 'Learn AI' },
  { value: 'mentor-others', label: 'Mentor Others' },
  { value: 'find-mentor', label: 'Find Mentor' },
  { value: 'investors', label: 'Find Investors' },
  { value: 'portfolio-feedback', label: 'Get Portfolio Feedback' }
]

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: [] as string[],
    careerGoals: ''
  })

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || formData.interests.length === 0 || !formData.careerGoals) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      // Generate a simple user ID for demo purposes
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Store user data in localStorage for demo
      localStorage.setItem('nuconnect_user', JSON.stringify({
        id: userId,
        ...formData
      }))
      
      toast({
        title: 'Welcome to NuConnect!',
        description: 'Your profile has been created successfully.'
      })
      
      // Redirect to intake flow
      router.push(`/intake?userId=${userId}`)
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-inkwell via-lunar to-inkwell text-aulait py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-aulait rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold text-inkwell">N</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
            Join NuConnect
          </h1>
          <p className="text-2xl text-aulait/90 max-w-3xl mx-auto">
            AI-powered professional connections and networking platform
          </p>
        </div>
      </div>
      
      <div className="min-h-screen bg-aulait py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-8 bg-gradient-to-br from-aulait/20 to-white">
              <CardTitle className="text-3xl font-bold text-inkwell">
                Create Your Profile
              </CardTitle>
              <p className="text-lunar mt-2">Tell us about your professional interests and goals</p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-inkwell font-semibold text-lg">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="border-2 border-lunar/30 focus:ring-2 focus:ring-lunar focus:border-lunar rounded-xl h-14 text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-inkwell font-semibold text-lg">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              className="border-2 border-lunar/30 focus:ring-2 focus:ring-lunar focus:border-lunar rounded-xl h-14 text-lg"
              required
            />
          </div>

          <div className="space-y-4">
            <Label className="text-inkwell font-semibold text-lg">
              Professional Interests * (Select all that apply)
            </Label>
            <div className="flex flex-wrap gap-3">
              {INTERESTS_OPTIONS.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all duration-200 px-4 py-2 text-sm font-medium ${
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-inkwell to-lunar text-aulait hover:shadow-lg transform hover:scale-105'
                      : 'border-2 border-lunar/30 text-lunar hover:bg-lunar/10 hover:border-lunar'
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-inkwell font-semibold text-lg">
              Primary Career Goal *
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAREER_GOALS_OPTIONS.map((goal) => (
                <label
                  key={goal.value}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.careerGoals === goal.value
                      ? 'border-inkwell bg-gradient-to-r from-inkwell/5 to-lunar/5 text-inkwell shadow-lg transform scale-105'
                      : 'border-lunar/30 text-lunar hover:bg-lunar/5 hover:border-lunar'
                  }`}
                >
                  <input
                    type="radio"
                    name="careerGoals"
                    value={goal.value}
                    checked={formData.careerGoals === goal.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                    className="sr-only"
                  />
                  <span className="font-semibold">{goal.label}</span>
                </label>
              ))}
            </div>
          </div>

                <PrimaryButton
                  type="submit"
                  loading={loading}
                  size="xl"
                  className="w-full shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  Continue to Profile Setup
                </PrimaryButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
