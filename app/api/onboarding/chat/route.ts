export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { openrouterChat } from '@/lib/ai/openrouter'
import { INDUSTRIES, SKILLS, OBJECTIVES, SEEKING, SENIORITY } from '@/shared/taxonomy'
import fs from 'node:fs/promises'
import path from 'node:path'

type ClientMsg = { userText?: string; formData?: Record<string, any>; state?: string }

// Simple state progression map
const STATE_PROGRESSION = {
  'GREETING': 'SNAPSHOT',
  'SNAPSHOT': 'FOCUS', 
  'FOCUS': 'INTENT',
  'INTENT': 'POLISH',
  'POLISH': 'DONE'
} as const

export async function POST(req: Request) {
  const sb = await createSupabaseServerClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const input = (await req.json().catch(() => ({}))) as ClientMsg
  const { data: profile } = await sb.from('profiles').select('*').eq('user_id', user.id).maybeSingle()

  // Merge formData into profile if present (autosave)
  let updatedProfile = profile
  if (input.formData && Object.keys(input.formData).length) {
    const patch = { ...input.formData, updated_at: new Date().toISOString(), onboarding_stage: 'in_progress' }
    const { data: updated } = await sb.from('profiles').update(patch).eq('user_id', user.id).select().single()
    updatedProfile = updated || { ...profile, ...patch }
  }

  // Use explicit state from input, or get from profile, or default to GREETING
  const stage = input.state || updatedProfile?.onboarding_current_state || 'GREETING'
  const TAXONOMY = { INDUSTRIES, SKILLS, OBJECTIVES, SEEKING, SENIORITY }
  const promptPath = path.join(process.cwd(), 'prompts', 'onboarding-convo.md')
  const base = await fs.readFile(promptPath, 'utf8')

  const filled = base
    .replace('{profile_json}', JSON.stringify(updatedProfile || {}))
    .replace('{TAXONOMY}', JSON.stringify(TAXONOMY))
    .replace('{STATE}', stage)

  // Use deterministic responses instead of AI to prevent looping
  let ai: any
  
  // Assemble conversation: keep transcript short (last ~8 turns)
  const transcript: any[] = Array.isArray(updatedProfile?.onboarding_transcript) ? updatedProfile!.onboarding_transcript : []
  if (input.userText) {
    transcript.push({ id: crypto.randomUUID(), role: 'user', content: input.userText, ts: new Date().toISOString() })
  }

  // Deterministic state machine - no AI calls
  if (stage === 'GREETING') {
    if (input.userText) {
      ai = { 
        message: "Perfect! Let's start with the basics. What's your current role and company?", 
        ask: {
          fields: [
            { key: 'role', label: 'Your Role', type: 'text', placeholder: 'e.g. Software Engineer' },
            { key: 'company', label: 'Company', type: 'text', placeholder: 'e.g. Google' },
            { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. San Francisco, CA' }
          ],
          cta: 'Continue'
        },
        nextState: 'SNAPSHOT' 
      }
    } else {
      ai = { 
        message: "Welcome to NuConnect! I'll help you create a great profile in just 60-90 seconds. Ready to get started?", 
        quickReplies: ['Yes, let\'s go!', 'Tell me more'], 
        nextState: 'GREETING' 
      }
    }
  } else if (stage === 'SNAPSHOT') {
    if (input.formData && Object.keys(input.formData).length) {
      // Form submitted, move to next state
      ai = {
        message: "Great! Now let's focus on your expertise. Select your industries and key skills.",
        ask: {
          fields: [
            { key: 'industries', label: 'Industries (max 3)', type: 'multi-select', options: INDUSTRIES, max: 3 },
            { key: 'skills', label: 'Key Skills (max 5)', type: 'multi-select', options: SKILLS, max: 5 }
          ],
          cta: 'Continue'
        },
        nextState: 'FOCUS'
      }
    } else {
      ai = { 
        message: "Let's start with the basics. What's your current role and company?", 
        ask: {
          fields: [
            { key: 'role', label: 'Your Role', type: 'text', placeholder: 'e.g. Software Engineer' },
            { key: 'company', label: 'Company', type: 'text', placeholder: 'e.g. Google' },
            { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. San Francisco, CA' }
          ],
          cta: 'Continue'
        },
        nextState: 'SNAPSHOT' 
      }
    }
  } else if (stage === 'FOCUS') {
    if (input.formData && Object.keys(input.formData).length) {
      // Form submitted, move to next state
      ai = {
        message: "Excellent! What are your networking goals? What type of people do you want to meet?",
        ask: {
          fields: [
            { key: 'objectives', label: 'Your Objectives', type: 'multi-select', options: OBJECTIVES, max: 3 },
            { key: 'seeking', label: 'Who You Want to Meet', type: 'multi-select', options: SEEKING, max: 3 }
          ],
          cta: 'Continue'
        },
        nextState: 'INTENT'
      }
    } else {
      ai = {
        message: "Now let's focus on your expertise. Select your industries and key skills.",
        ask: {
          fields: [
            { key: 'industries', label: 'Industries (max 3)', type: 'multi-select', options: INDUSTRIES, max: 3 },
            { key: 'skills', label: 'Key Skills (max 5)', type: 'multi-select', options: SKILLS, max: 5 }
          ],
          cta: 'Continue'
        },
        nextState: 'FOCUS'
      }
    }
  } else if (stage === 'INTENT') {
    if (input.formData && Object.keys(input.formData).length) {
      // Form submitted, move to final state
      ai = {
        message: "Perfect! Your profile is almost ready. Let me create a headline and bio for you.",
        quickReplies: ['Generate my profile', 'Let me review first'],
        nextState: 'POLISH'
      }
    } else {
      ai = {
        message: "What are your networking goals? What type of people do you want to meet?",
        ask: {
          fields: [
            { key: 'objectives', label: 'Your Objectives', type: 'multi-select', options: OBJECTIVES, max: 3 },
            { key: 'seeking', label: 'Who You Want to Meet', type: 'multi-select', options: SEEKING, max: 3 }
          ],
          cta: 'Continue'
        },
        nextState: 'INTENT'
      }
    }
  } else if (stage === 'POLISH') {
    ai = {
      message: "All set! Your profile is complete and ready to help you make great connections.",
      quickReplies: ['Start networking!'],
      nextState: 'DONE'
    }
  } else {
    ai = { 
      message: "Welcome to NuConnect! I'll help you create a great profile in just 60-90 seconds. Ready to get started?", 
      quickReplies: ['Yes, let\'s go!', 'Tell me more'], 
      nextState: 'GREETING' 
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

  // Save current state and transcript
  const update: any = { 
    onboarding_transcript: transcript, 
    onboarding_stage: ai.nextState === 'DONE' ? 'complete' : 'in_progress',
    onboarding_current_state: ai.nextState, // Track current state explicitly
    updated_at: new Date().toISOString() 
  }
  await sb.from('profiles').update(update).eq('user_id', user.id)

  return NextResponse.json(ai)
}
