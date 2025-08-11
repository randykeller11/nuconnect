'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrandHeader } from '@/components/BrandHeader'
import { FormCard } from '@/components/FormCard'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
      <BrandHeader 
        title="Join NuConnect"
        subtitle="AI-powered professional connections and networking platform"
      />
      
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-inkwell font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="border-lunar/30 focus:ring-lunar rounded-xl h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-inkwell font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              className="border-lunar/30 focus:ring-lunar rounded-xl h-12"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-inkwell font-medium">
              Professional Interests * (Select all that apply)
            </Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_OPTIONS.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-inkwell text-aulait hover:bg-lunar'
                      : 'border-lunar/30 text-lunar hover:bg-lunar/10'
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-inkwell font-medium">
              Primary Career Goal *
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAREER_GOALS_OPTIONS.map((goal) => (
                <label
                  key={goal.value}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                    formData.careerGoals === goal.value
                      ? 'border-inkwell bg-inkwell/5 text-inkwell'
                      : 'border-lunar/30 text-lunar hover:bg-lunar/5'
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
                  <span className="font-medium">{goal.label}</span>
                </label>
              ))}
            </div>
          </div>

          <PrimaryButton
            type="submit"
            loading={loading}
            size="lg"
            className="w-full"
          >
            Continue to Profile Setup
          </PrimaryButton>
        </form>
      </FormCard>
    </div>
  )
}
