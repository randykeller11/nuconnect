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
    // More aggressive JSON cleaning
    let cleanedRaw = raw.trim()
    
    // Remove trailing commas before closing braces/brackets
    cleanedRaw = cleanedRaw.replace(/,(\s*[}\]])/g, '$1')
    
    // Remove control characters
    cleanedRaw = cleanedRaw.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    
    // Fix common JSON issues
    cleanedRaw = cleanedRaw.replace(/,(\s*,)/g, ',') // Remove double commas
    cleanedRaw = cleanedRaw.replace(/:\s*,/g, ': null,') // Fix empty values
    
    console.log('Cleaned JSON:', cleanedRaw)
    ai = JSON.parse(cleanedRaw)
    
    // Ensure nextState is valid and progresses
    if (!ai.nextState || !['GREETING', 'SNAPSHOT', 'FOCUS', 'INTENT', 'POLISH', 'DONE'].includes(ai.nextState)) {
      ai.nextState = stage
    }
    
    // Simple progression logic
    if (stage === 'GREETING' && input.userText && 
        (input.userText.toLowerCase().includes('yes') || 
         input.userText.toLowerCase().includes('start') ||
         input.userText.toLowerCase().includes('go'))) {
      ai.nextState = STATE_PROGRESSION[stage]
    }
    
    // If we just saved form data, always progress to next state
    if (input.formData && Object.keys(input.formData).length && stage in STATE_PROGRESSION) {
      ai.nextState = STATE_PROGRESSION[stage as keyof typeof STATE_PROGRESSION]
    }
    
  } catch (error) {
    console.error('Failed to parse AI response:', error, 'Raw response:', raw)
    
    // Simplified fallback responses that always progress
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
          nextState: 'FOCUS' 
        }
      } else {
        ai = { 
          message: "Welcome to NuConnect! I'll help you create a great profile in just 60-90 seconds. Ready to get started?", 
          quickReplies: ['Yes, let\'s go!', 'Tell me more'], 
          nextState: 'SNAPSHOT' 
        }
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
    } else if (stage === 'FOCUS') {
      ai = {
        message: "Now let's focus on your expertise. Select your industries and key skills.",
        ask: {
          fields: [
            { key: 'industries', label: 'Industries (max 3)', type: 'multi-select', options: INDUSTRIES, max: 3 },
            { key: 'skills', label: 'Key Skills (max 5)', type: 'multi-select', options: SKILLS, max: 5 }
          ],
          cta: 'Continue'
        },
        nextState: 'INTENT'
      }
    } else if (stage === 'INTENT') {
      ai = {
        message: "What are your networking goals? What type of people do you want to meet?",
        ask: {
          fields: [
            { key: 'objectives', label: 'Your Objectives', type: 'multi-select', options: OBJECTIVES, max: 3 },
            { key: 'seeking', label: 'Who You Want to Meet', type: 'multi-select', options: SEEKING, max: 3 }
          ],
          cta: 'Continue'
        },
        nextState: 'POLISH'
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
