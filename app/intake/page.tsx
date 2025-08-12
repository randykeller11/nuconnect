'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormCard } from '@/components/FormCard'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/lib/hooks/use-toast'
import type { IntakeQuestion } from '@/lib/pipeline/stateMachine'

function IntakePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const userId = searchParams.get('userId')
  
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<IntakeQuestion | null>(null)
  const [answer, setAnswer] = useState<any>('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!userId) {
      router.push('/login')
      return
    }
    
    fetchNextQuestion()
  }, [userId])

  const fetchNextQuestion = async () => {
    if (!userId) return
    
    try {
      const response = await fetch(`/api/intake/questions?userId=${userId}`)
      const data = await response.json()
      
      if (data.isComplete) {
        setIsComplete(true)
        toast({
          title: 'Profile Complete!',
          description: 'Your professional profile has been set up successfully.'
        })
        // Redirect to rooms or dashboard
        router.push('/rooms')
        return
      }
      
      if (data.question) {
        setCurrentQuestion(data.question)
        setAnswer(data.question.type === 'multiselect' ? [] : '')
      }
    } catch (error) {
      console.error('Error fetching question:', error)
      toast({
        title: 'Error',
        description: 'Failed to load next question.',
        variant: 'destructive'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId || !currentQuestion) return
    
    // Validate answer
    if (currentQuestion.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
      toast({
        title: 'Answer Required',
        description: 'Please provide an answer to continue.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/intake/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answer })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to process answer')
      }
      
      if (data.isComplete) {
        setIsComplete(true)
        toast({
          title: 'Profile Complete!',
          description: 'Your professional profile has been set up successfully.'
        })
        router.push('/rooms')
        return
      }
      
      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion)
        setAnswer(data.nextQuestion.type === 'multiselect' ? [] : '')
      } else {
        fetchNextQuestion()
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit answer.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMultiselectToggle = (option: string) => {
    setAnswer((prev: string[]) => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  if (isComplete) {
    return (
      <FormCard title="Profile Complete!">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lunar">
            Your professional profile has been created successfully. You can now join networking events and get matched with relevant professionals.
          </p>
          <PrimaryButton onClick={() => router.push('/rooms')}>
            Explore Networking Events
          </PrimaryButton>
        </div>
      </FormCard>
    )
  }

  if (!currentQuestion) {
    return (
      <FormCard title="Setting up your profile...">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-inkwell/30 border-t-inkwell rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lunar">Loading next question...</p>
        </div>
      </FormCard>
    )
  }

  return (
    <FormCard title="Set up your profile">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-inkwell font-medium text-lg">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {currentQuestion.type === 'text' && (
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="border-lunar/30 focus:ring-lunar rounded-xl h-12"
              required={currentQuestion.required}
            />
          )}
          
          {currentQuestion.type === 'multiselect' && currentQuestion.options && (
            <div className="flex flex-wrap gap-2">
              {currentQuestion.options.map((option) => (
                <Badge
                  key={option}
                  variant={answer.includes(option) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    answer.includes(option)
                      ? 'bg-inkwell text-aulait hover:bg-lunar'
                      : 'border-lunar/30 text-lunar hover:bg-lunar/10'
                  }`}
                  onClick={() => handleMultiselectToggle(option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'select' && currentQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentQuestion.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                    answer === option
                      ? 'border-inkwell bg-inkwell/5 text-inkwell'
                      : 'border-lunar/30 text-lunar hover:bg-lunar/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answer === option}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-medium capitalize">{option.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'radio' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                    answer === option
                      ? 'border-inkwell bg-inkwell/5 text-inkwell'
                      : 'border-lunar/30 text-lunar hover:bg-lunar/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answer === option}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-medium capitalize">{option.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <PrimaryButton
          type="submit"
          loading={loading}
          size="lg"
          className="w-full"
        >
          Continue
        </PrimaryButton>
      </form>
    </FormCard>
  )
}

export default function IntakePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-aulait flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-inkwell/30 border-t-inkwell rounded-full animate-spin" />
      </div>
    }>
      <IntakePageContent />
    </Suspense>
  )
}
