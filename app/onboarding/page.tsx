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
  nextState: 'GREETING' | 'SNAPSHOT' | 'FOCUS' | 'INTENT' | 'POLISH' | 'DONE'
}

function DynamicForm({ ask, onSubmit }: { ask: AiReply['ask'], onSubmit: (data: Record<string, any>) => void }) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  if (!ask) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {ask.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              {field.type === 'text' || field.type === 'location' || field.type === 'url' ? (
                <Input
                  type={field.type === 'url' ? 'url' : 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                />
              ) : field.type === 'select' ? (
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                >
                  <option value="">Select...</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'multi-select' ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(formData[field.key] || []).map((item: string) => (
                      <Badge key={item} variant="secondary" className="cursor-pointer" onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          [field.key]: (prev[field.key] || []).filter((i: string) => i !== item)
                        }))
                      }}>
                        {item} ×
                      </Badge>
                    ))}
                  </div>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(formData[field.key] || []).includes(e.target.value)) {
                        const current = formData[field.key] || []
                        if (!field.max || current.length < field.max) {
                          setFormData(prev => ({
                            ...prev,
                            [field.key]: [...current, e.target.value]
                          }))
                        }
                      }
                    }}
                  >
                    <option value="">Add {field.label.toLowerCase()}...</option>
                    {field.options?.map(option => (
                      <option key={option} value={option} disabled={(formData[field.key] || []).includes(option)}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {field.max && (
                    <p className="text-xs text-muted-foreground">
                      {(formData[field.key] || []).length} / {field.max} selected
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          ))}
          <Button type="submit" className="w-full">
            {ask.cta}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function OnboardingChat() {
  const [ai, setAi] = useState<AiReply | null>(null)
  const [state, setState] = useState<'GREETING' | 'SNAPSHOT' | 'FOCUS' | 'INTENT' | 'POLISH' | 'DONE'>('GREETING')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const router = useRouter()

  async function call(body: any) {
    setBusy(true)
    try {
      const res = await fetch('/api/onboarding/chat', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body) 
      })
      const j = await res.json()
      
      if (res.ok) {
        setAi(j)
        setState(j.nextState)
        
        // Add to transcript
        if (body.userText) {
          setTranscript(prev => [...prev, { role: 'user', content: body.userText }])
        }
        setTranscript(prev => [...prev, { role: 'assistant', content: j.message }])
        
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
    call({ state: 'GREETING' }) 
  }, [])

  function onQuick(r: string) { 
    call({ userText: r, state }) 
  }

  async function onSubmitText() {
    const text = input.trim()
    if (!text) return
    setInput('')
    await call({ userText: text, state })
  }

  async function onSubmitForm(formData: Record<string, any>) {
    await call({ formData, state })
  }

  const progressSteps = ['GREETING', 'SNAPSHOT', 'FOCUS', 'INTENT', 'POLISH']
  const currentStepIndex = progressSteps.indexOf(state)

  return (
    <div className="min-h-screen bg-gradient-to-br from-aulait to-aulait/80 p-4">
      <div className="mx-auto max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-6 flex justify-center">
          <div className="flex space-x-2">
            {progressSteps.map((step, index) => (
              <div
                key={step}
                className={`h-2 w-8 rounded-full ${
                  index <= currentStepIndex ? 'bg-inkwell' : 'bg-lunar/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Chat messages */}
        <div className="space-y-4 mb-6">
          {transcript.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-inkwell text-aulait' 
                  : 'bg-white text-inkwell shadow-sm'
              }`}>
                <p className="text-[15px] leading-6">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Current AI message with quick replies */}
        {ai?.message && (
          <Card className="mb-4 shadow-lg">
            <CardContent className="p-4">
              <p className="text-[15px] leading-6 mb-3">{ai.message}</p>
              {ai.quickReplies && ai.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ai.quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      onClick={() => onQuick(reply)}
                      disabled={busy}
                      className="rounded-full"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dynamic form */}
        {ai?.ask && (
          <DynamicForm ask={ai.ask} onSubmit={onSubmitForm} />
        )}

        {/* Text input */}
        {state !== 'DONE' && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a reply…"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && onSubmitText()}
                  disabled={busy}
                />
                <Button 
                  onClick={onSubmitText} 
                  disabled={busy || !input.trim()}
                  className="bg-inkwell hover:bg-inkwell/90 text-aulait"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading indicator */}
        {busy && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-inkwell mr-2"></div>
              <span className="text-sm text-lunar">Thinking...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
