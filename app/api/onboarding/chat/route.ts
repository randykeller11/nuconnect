export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { openrouterChat } from '@/lib/ai/openrouter'
import { INDUSTRIES, SKILLS, OBJECTIVES, SEEKING, SENIORITY } from '@/shared/taxonomy'
import fs from 'node:fs/promises'
import path from 'node:path'

type ClientMsg = { userText?: string; formData?: Record<string, any>; state?: string }

function nextStateFromProfile(p: any) {
  if (!p?.role || !p?.company || !p?.location) return 'SNAPSHOT'
  if (!p?.industries?.length || !p?.skills?.length) return 'FOCUS'
  if (!p?.objectives?.length || !p?.seeking?.length) return 'INTENT'
  if (!p?.ai_bio || !p?.headline) return 'POLISH'
  return 'DONE'
}

export async function POST(req: Request) {
  const sb = await createSupabaseServerClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const input = (await req.json().catch(() => ({}))) as ClientMsg
  const { data: profile } = await sb.from('profiles').select('*').eq('user_id', user.id).maybeSingle()

  // Merge formData into profile if present (autosave)
  if (input.formData && Object.keys(input.formData).length) {
    const patch = { ...input.formData, updated_at: new Date().toISOString(), onboarding_stage: 'in_progress' }
    await sb.from('profiles').update(patch).eq('user_id', user.id)
  }

  const stage = input.state || nextStateFromProfile(profile)
  const TAXONOMY = { INDUSTRIES, SKILLS, OBJECTIVES, SEEKING, SENIORITY }
  const promptPath = path.join(process.cwd(), 'prompts', 'onboarding-convo.md')
  const base = await fs.readFile(promptPath, 'utf8')

  const filled = base
    .replace('{profile_json}', JSON.stringify(profile || {}))
    .replace('{TAXONOMY}', JSON.stringify(TAXONOMY))
    .replace('{STATE}', stage)

  // Simple cost control: if userText is empty and no formData, don't call the model
  if (!input.userText && !input.formData && stage !== 'GREETING') {
    return NextResponse.json({
      message: 'Ready when you are—shall we continue?',
      quickReplies: ['Yes', 'Skip for now'],
      nextState: stage,
    })
  }

  // Assemble conversation: keep transcript short (last ~8 turns)
  const transcript: any[] = Array.isArray(profile?.onboarding_transcript) ? profile!.onboarding_transcript : []
  if (input.userText) {
    transcript.push({ id: crypto.randomUUID(), role: 'user', content: input.userText, ts: new Date().toISOString() })
  }

  const messages = [
    { role: 'system', content: 'Reply in strict JSON only.' },
    { role: 'user', content: filled },
  ] as const

  const raw = await openrouterChat(messages as any, 'openai/gpt-4o-mini', 0.2)
  let ai: any
  try { 
    // Clean up common JSON issues before parsing
    const cleanedRaw = raw
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim()
    
    ai = JSON.parse(cleanedRaw)
    
    // Ensure nextState is valid and progresses
    if (!ai.nextState || !['GREETING', 'SNAPSHOT', 'FOCUS', 'INTENT', 'POLISH', 'DONE'].includes(ai.nextState)) {
      ai.nextState = stage
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error, 'Raw response:', raw)
    // Better fallback based on current state with progression
    if (stage === 'GREETING') {
      ai = { 
        message: "Welcome to NuConnect! I'll help you create a great profile in just 60-90 seconds. Ready to get started?", 
        quickReplies: ['Yes, let\'s go!', 'Tell me more'], 
        nextState: 'SNAPSHOT' 
      }
    } else if (stage === 'SNAPSHOT') {
      ai = { 
        message: "Great! Let's start with the basics. What's your current role and company?", 
        ask: {
          fields: [
            { key: 'role', label: 'Your Role', type: 'text', placeholder: 'e.g. Software Engineer' },
            { key: 'company', label: 'Company', type: 'text', placeholder: 'e.g. Google' },
            { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. San Francisco, CA' }
          ],
          cta: 'Continue'
        },
        nextState: 'FOCUS' 
      }
    } else {
      ai = { message: "Let's continue with your profile setup.", quickReplies: ['Continue'], nextState: stage }
    }
  }

  // Append AI turn to transcript
  transcript.push({ 
    id: crypto.randomUUID(), 
    role: 'assistant', 
    content: ai.message, 
    ts: new Date().toISOString(), 
    meta: { quickReplies: ai.quickReplies, ask: ai.ask } 
  })

  // If POLISH produced headline/bio via formData in the next call, we'll save there.
  const update: any = { 
    onboarding_transcript: transcript, 
    onboarding_stage: ai.nextState === 'DONE' ? 'complete' : 'in_progress', 
    updated_at: new Date().toISOString() 
  }
  await sb.from('profiles').update(update).eq('user_id', user.id)

  return NextResponse.json(ai)
}
