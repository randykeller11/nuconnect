'use client'
import { useEffect, useRef, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type AiReply = {
  message: string
  quickReplies?: string[]
  chips?: { type: 'industries' | 'skills' | 'objectives' | 'seeking', options: string[] }[]
  ask?: {
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'select' | 'multi-select' | 'location' | 'url'
      options?: string[]
      max?: number
      placeholder?: string
    }>
    cta: string
  }
  nextState: 'GREETING' | 'IDENTITY' | 'PROFESSIONAL' | 'GOALS' | 'PERSONALIZATION' | 'DONE'
}

function DynamicForm({ ask, onSubmit }: { ask: AiReply['ask'], onSubmit: (data: Record<string, any>) => void }) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  if (!ask) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {ask.fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="block text-base font-medium text-inkwell">
              {field.label}
              {field.max && (
                <span className="text-sm text-lunar ml-1">(max {field.max})</span>
              )}
            </label>
            
            {field.type === 'text' || field.type === 'location' || field.type === 'url' ? (
              <Input
                type={field.type === 'url' ? 'url' : 'text'}
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="h-12 text-base border-2 border-lunar/20 focus:border-inkwell rounded-lg"
              />
            ) : field.type === 'select' ? (
              <select
                className="w-full h-12 text-base rounded-lg border-2 border-lunar/20 focus:border-inkwell bg-background px-4"
                value={formData[field.key] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
              >
                <option value="">Select...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'multi-select' ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 min-h-[3rem] p-3 border-2 border-lunar/20 rounded-lg bg-background">
                  {(formData[field.key] || []).length === 0 ? (
                    <span className="text-lunar italic">Click options below to add them</span>
                  ) : (
                    (formData[field.key] || []).map((item: string) => (
                      <Badge 
                        key={item} 
                        variant="secondary" 
                        className="cursor-pointer bg-inkwell text-aulait hover:bg-lunar px-3 py-1 text-sm" 
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            [field.key]: (prev[field.key] || []).filter((i: string) => i !== item)
                          }))
                        }}
                      >
                        {item} ×
                      </Badge>
                    ))
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {field.options?.map(option => {
                    const isSelected = (formData[field.key] || []).includes(option)
                    const isMaxReached = field.max && (formData[field.key] || []).length >= field.max
                    
                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={!isSelected && isMaxReached}
                        onClick={() => {
                          if (isSelected) {
                            setFormData(prev => ({
                              ...prev,
                              [field.key]: (prev[field.key] || []).filter((i: string) => i !== option)
                            }))
                          } else if (!isMaxReached) {
                            setFormData(prev => ({
                              ...prev,
                              [field.key]: [...(prev[field.key] || []), option]
                            }))
                          }
                        }}
                        className={`p-3 text-sm rounded-lg border-2 transition-all text-left ${
                          isSelected 
                            ? 'border-inkwell bg-inkwell text-aulait' 
                            : isMaxReached
                            ? 'border-lunar/20 bg-lunar/10 text-lunar/50 cursor-not-allowed'
                            : 'border-lunar/20 bg-background text-inkwell hover:border-inkwell hover:bg-inkwell/5'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
                
                {field.max && (
                  <p className="text-sm text-lunar text-center">
                    {(formData[field.key] || []).length} / {field.max} selected
                  </p>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-14 text-lg bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait rounded-xl shadow-lg transition-all duration-300"
      >
        {ask.cta}
      </Button>
    </form>
  )
}

export default function OnboardingChat() {
  const [ai, setAi] = useState<AiReply | null>(null)
  const [state, setState] = useState<'GREETING' | 'IDENTITY' | 'PROFESSIONAL' | 'GOALS' | 'PERSONALIZATION' | 'DONE'>('GREETING')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [lastCallTime, setLastCallTime] = useState(0)
  const router = useRouter()

  async function call(body: any) {
    // Rate limiting: prevent calls within 1 second of each other
    const now = Date.now()
    if (now - lastCallTime < 1000) {
      return
    }
    setLastCallTime(now)
    
    setBusy(true)
    try {
      const res = await fetch('/api/onboarding/chat', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body) 
      })
      const j = await res.json()
      
      if (res.ok) {
        // Only update if we got a different message or state change
        const isDifferentMessage = !ai || ai.message !== j.message
        const isStateChange = j.nextState !== state
        
        if (isDifferentMessage || isStateChange) {
          setAi(j)
          setState(j.nextState)
          
          // Add to transcript only if it's a new message
          if (body.userText && isDifferentMessage) {
            setTranscript(prev => [...prev, { role: 'user', content: body.userText }])
          }
          if (isDifferentMessage) {
            setTranscript(prev => [...prev, { role: 'assistant', content: j.message }])
          }
        }
        
        if (j.nextState === 'DONE') {
          toast.success('Onboarding complete!')
          setTimeout(() => router.push('/home'), 2000)
        }
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Network error. Please check your connection.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { 
    // Check auth first
    const checkAuth = async () => {
      const supabase = supabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      // Start onboarding
      call({ state: 'GREETING' })
    }
    checkAuth()
  }, [])

  function onQuick(r: string) { 
    // Pass current state explicitly with user text
    call({ userText: r, state }) 
  }

  async function onSubmitText() {
    const text = input.trim()
    if (!text) return
    setInput('')
    await call({ userText: text, state })
  }

  async function onSubmitForm(formData: Record<string, any>) {
    // Pass current state explicitly when submitting form data
    await call({ formData, state })
  }

  const progressSteps = ['IDENTITY', 'PROFESSIONAL', 'GOALS', 'PERSONALIZATION']
  const currentStepIndex = progressSteps.indexOf(state)

  const stepTitles = {
    'GREETING': 'Welcome',
    'IDENTITY': 'Basic Identity',
    'PROFESSIONAL': 'Professional Info',
    'GOALS': 'Networking Goals',
    'PERSONALIZATION': 'Personal Touches',
    'DONE': 'Complete'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aulait to-aulait/80 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-inkwell to-lunar rounded-full flex items-center justify-center shadow-lg mb-6">
            <span className="text-3xl font-bold text-aulait">N</span>
          </div>
          <h1 className="text-3xl font-bold text-inkwell mb-2">Create Your Profile</h1>
          <p className="text-xl text-lunar">Let's get you connected with the right professionals</p>
        </div>

        {/* Progress indicator */}
        {state !== 'GREETING' && state !== 'DONE' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-lunar">
                Step {currentStepIndex + 1} of {progressSteps.length}
              </span>
              <span className="text-sm font-medium text-lunar">
                {stepTitles[state]}
              </span>
            </div>
            <div className="w-full bg-lunar/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-inkwell to-lunar h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / progressSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main content card */}
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            {/* Welcome state */}
            {state === 'GREETING' && (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-inkwell">{ai?.message}</h2>
                  <p className="text-lg text-lunar">This will only take a few minutes</p>
                </div>
                {ai?.quickReplies && (
                  <div className="flex justify-center gap-4">
                    {ai.quickReplies.map((reply) => (
                      <Button
                        key={reply}
                        onClick={() => onQuick(reply)}
                        disabled={busy}
                        className="px-8 py-3 text-lg bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait rounded-xl shadow-lg transition-all duration-300"
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form states */}
            {state !== 'GREETING' && state !== 'DONE' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-inkwell">{ai?.message}</h2>
                  {state === 'IDENTITY' && (
                    <p className="text-lunar">Let's start with the basics</p>
                  )}
                  {state === 'PROFESSIONAL' && (
                    <p className="text-lunar">Tell us about your work</p>
                  )}
                  {state === 'GOALS' && (
                    <p className="text-lunar">What do you want to achieve?</p>
                  )}
                  {state === 'PERSONALIZATION' && (
                    <p className="text-lunar">Add some personal touches</p>
                  )}
                </div>
                
                {ai?.ask && (
                  <DynamicForm ask={ai.ask} onSubmit={onSubmitForm} />
                )}
              </div>
            )}

            {/* Completion state */}
            {state === 'DONE' && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-inkwell">{ai?.message}</h2>
                  <p className="text-lg text-lunar">Your profile is ready to help you make meaningful connections</p>
                </div>
                {ai?.quickReplies && (
                  <div className="flex justify-center gap-4">
                    {ai.quickReplies.map((reply) => (
                      <Button
                        key={reply}
                        onClick={() => onQuick(reply)}
                        disabled={busy}
                        className="px-8 py-3 text-lg bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait rounded-xl shadow-lg transition-all duration-300"
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading indicator */}
        {busy && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-inkwell mr-3"></div>
              <span className="text-base text-lunar font-medium">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
