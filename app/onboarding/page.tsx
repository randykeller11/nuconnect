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
      type: 'text' | 'select' | 'multi-select' | 'location' | 'url' | 'file'
      options?: string[]
      max?: number
      placeholder?: string
    }>
    cta: string
  }
  nextState: 'GREETING' | 'IDENTITY' | 'PROFESSIONAL' | 'GOALS' | 'CONNECTIONS' | 'PERSONALIZATION' | 'PROFILE_SETUP' | 'DONE'
}

function DynamicForm({ ask, onSubmit }: { ask: AiReply['ask'], onSubmit: (data: Record<string, any>) => void }) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [customRole, setCustomRole] = useState('')
  const [showCustomRole, setShowCustomRole] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  if (!ask) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalData = { ...formData }
    
    // Handle custom role input
    if (showCustomRole && customRole.trim()) {
      finalData.role = customRole.trim()
    }
    
    // Handle LinkedIn username conversion to full URL
    if (finalData.linkedin_url && !finalData.linkedin_url.startsWith('http')) {
      finalData.linkedin_url = `https://linkedin.com/in/${finalData.linkedin_url}`
    }
    
    onSubmit(finalData)
  }

  const handleRoleChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomRole(true)
      setFormData(prev => ({ ...prev, role: '' }))
    } else {
      setShowCustomRole(false)
      setCustomRole('')
      setFormData(prev => ({ ...prev, role: value }))
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formDataUpload
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const { path, url } = await response.json()
      setFormData(prev => ({ 
        ...prev, 
        avatar_url: path, 
        profile_photo_url: url 
      }))
    } catch (error: any) {
      console.error('Photo upload failed:', error.message)
    } finally {
      setUploadingPhoto(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {ask.fields.map((field) => (
          <div key={field.key} className="space-y-4">
            <div className="text-center mb-6">
              <label className="block text-xl font-semibold text-inkwell mb-2">
                {field.label}
              </label>
              {field.max && (
                <p className="text-sm text-lunar">Choose up to {field.max} options</p>
              )}
            </div>
            
            {field.key === 'profile_photo' ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-lunar/20 overflow-hidden border-4 border-white shadow-lg mb-4">
                    {formData.profile_photo_url ? (
                      <img 
                        src={formData.profile_photo_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lunar">
                        <span className="text-4xl">📷</span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-6 py-3 bg-inkwell text-aulait rounded-xl hover:bg-lunar transition-colors">
                      {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
              </div>
            ) : field.type === 'text' || field.type === 'location' || field.type === 'url' ? (
              <Input
                type={field.type === 'url' ? 'url' : 'text'}
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="h-14 text-lg border-2 border-lunar/20 focus:border-inkwell rounded-xl px-6"
              />
            ) : field.type === 'select' ? (
              <div className="space-y-4">
                <select
                  className="w-full h-14 text-lg rounded-xl border-2 border-lunar/20 focus:border-inkwell bg-background px-6 appearance-none cursor-pointer"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  <option value="">Select your role...</option>
                  {field.options?.slice(0, 8).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="Other">Other (type your own)</option>
                </select>
                
                {showCustomRole && (
                  <Input
                    placeholder="Type your role here..."
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="h-14 text-lg border-2 border-inkwell/50 focus:border-inkwell rounded-xl px-6 bg-inkwell/5"
                    autoFocus
                  />
                )}
              </div>
            ) : field.type === 'multi-select' ? (
              <div className="space-y-6">
                {/* Selected items display */}
                <div className="min-h-[4rem] p-6 border-2 border-lunar/20 rounded-xl bg-gradient-to-r from-aulait to-white/50">
                  {(formData[field.key] || []).length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-lunar text-lg">Your selections will appear here</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {(formData[field.key] || []).map((item: string) => (
                        <Badge 
                          key={item} 
                          variant="secondary" 
                          className="cursor-pointer bg-inkwell text-aulait hover:bg-lunar px-4 py-2 text-base rounded-full transition-all duration-200 hover:scale-105" 
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              [field.key]: (prev[field.key] || []).filter((i: string) => i !== item)
                            }))
                          }}
                        >
                          {item} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Options grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
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
                        className={`p-4 text-base rounded-xl border-2 transition-all duration-200 text-left font-medium ${
                          isSelected 
                            ? 'border-inkwell bg-inkwell text-aulait shadow-lg transform scale-105' 
                            : isMaxReached
                            ? 'border-lunar/20 bg-lunar/5 text-lunar/50 cursor-not-allowed'
                            : 'border-lunar/30 bg-white text-inkwell hover:border-inkwell hover:bg-inkwell/5 hover:shadow-md hover:scale-102'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
                
                {field.max && (
                  <div className="text-center">
                    <span className={`text-lg font-medium ${
                      (formData[field.key] || []).length >= field.max ? 'text-inkwell' : 'text-lunar'
                    }`}>
                      {(formData[field.key] || []).length} / {field.max} selected
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
        
        <div className="pt-8">
          <Button 
            type="submit" 
            className="w-full h-16 text-xl bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            {ask.cta}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function OnboardingChat() {
  const [ai, setAi] = useState<AiReply | null>(null)
  const [state, setState] = useState<'GREETING' | 'IDENTITY' | 'PROFESSIONAL' | 'GOALS' | 'CONNECTIONS' | 'PERSONALIZATION' | 'PROFILE_SETUP' | 'DONE'>('GREETING')
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
          // Don't auto-redirect - let user use the onscreen buttons
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
    // Handle completion buttons manually
    if (state === 'DONE') {
      if (r === 'View My Profile') {
        router.push('/profile')
        return
      } else if (r === 'Start Networking') {
        router.push('/home')
        return
      }
    }
    
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

  const progressSteps = ['IDENTITY', 'PROFESSIONAL', 'GOALS', 'CONNECTIONS', 'PERSONALIZATION', 'PROFILE_SETUP']
  const currentStepIndex = progressSteps.indexOf(state)

  const stepTitles = {
    'GREETING': 'Welcome',
    'IDENTITY': 'Basic Identity',
    'PROFESSIONAL': 'Professional Info',
    'GOALS': 'Networking Goals',
    'CONNECTIONS': 'Connection Preferences',
    'PERSONALIZATION': 'Personal Touches',
    'PROFILE_SETUP': 'Profile & Links',
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
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-semibold text-lunar">
                Step {currentStepIndex + 1} of {progressSteps.length}
              </span>
              <span className="text-base font-semibold text-lunar">
                {stepTitles[state]}
              </span>
            </div>
            <div className="w-full bg-lunar/20 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-inkwell to-lunar h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${((currentStepIndex + 1) / progressSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main content card */}
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden max-w-5xl mx-auto">
          <CardContent className="p-12">
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
              <div className="space-y-8">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl font-bold text-inkwell">{ai?.message}</h2>
                  {state === 'IDENTITY' && (
                    <p className="text-xl text-lunar">Let's start with the basics</p>
                  )}
                  {state === 'PROFESSIONAL' && (
                    <p className="text-xl text-lunar">Tell us about your work</p>
                  )}
                  {state === 'GOALS' && (
                    <p className="text-xl text-lunar">What do you want to achieve?</p>
                  )}
                  {state === 'CONNECTIONS' && (
                    <p className="text-xl text-lunar">Who would you like to meet?</p>
                  )}
                  {state === 'PERSONALIZATION' && (
                    <p className="text-xl text-lunar">Add some personal touches</p>
                  )}
                  {state === 'PROFILE_SETUP' && (
                    <p className="text-xl text-lunar">Complete your profile setup</p>
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
