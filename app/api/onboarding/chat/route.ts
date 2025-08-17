export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { openrouterChat } from '@/lib/ai/openrouter'
import { ROLES, INDUSTRIES, NETWORKING_GOALS, CONNECTION_PREFERENCES, SKILLS } from '@/shared/taxonomy'
import fs from 'node:fs/promises'
import path from 'node:path'

type ClientMsg = { userText?: string; formData?: Record<string, any>; state?: string }

// 4-step onboarding progression
const STATE_PROGRESSION = {
  'GREETING': 'IDENTITY',
  'IDENTITY': 'PROFESSIONAL', 
  'PROFESSIONAL': 'GOALS',
  'GOALS': 'PERSONALIZATION',
  'PERSONALIZATION': 'DONE'
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
    console.log('🔍 DEBUG: Attempting to save form data:', JSON.stringify(input.formData, null, 2))
    console.log('🔍 DEBUG: User ID:', user.id)
    console.log('🔍 DEBUG: Existing profile:', profile ? 'exists' : 'null')
    
    const patch = { 
      user_id: user.id,
      ...input.formData, 
      updated_at: new Date().toISOString(), 
      onboarding_stage: 'in_progress' 
    }
    
    console.log('🔍 DEBUG: Patch data to upsert:', JSON.stringify(patch, null, 2))
    
    // Use upsert to create profile if it doesn't exist
    const { data: updated, error: upsertError } = await sb
      .from('profiles')
      .upsert(patch)
      .select()
      .single()
    
    if (upsertError) {
      console.error('❌ Profile upsert error:', upsertError)
      console.error('❌ Full error object:', JSON.stringify(upsertError, null, 2))
    } else {
      console.log('✅ Profile upsert successful!')
      console.log('✅ Updated profile data:', JSON.stringify(updated, null, 2))
    }
    
    updatedProfile = updated || { ...profile, ...patch }
  }

  // Use explicit state from input, or default to GREETING
  const stage = input.state || 'GREETING'
  const TAXONOMY = { ROLES, INDUSTRIES, NETWORKING_GOALS, CONNECTION_PREFERENCES, SKILLS }
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

  // 4-step deterministic onboarding flow
  if (stage === 'GREETING') {
    if (input.userText) {
      ai = { 
        message: "Perfect! Let's start with your basic identity.", 
        ask: {
          fields: [
            { key: 'first_name', label: 'First Name', type: 'text', placeholder: 'Your first name' },
            { key: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Your last name' }
          ],
          cta: 'Continue'
        },
        nextState: 'IDENTITY' 
      }
    } else {
      ai = { 
        message: "Welcome to NuConnect! Let's create your networking profile in just a few quick steps.", 
        quickReplies: ['Get Started', 'Tell me more'], 
        nextState: 'GREETING' 
      }
    }
  } else if (stage === 'IDENTITY') {
    if (input.formData && Object.keys(input.formData).length) {
      ai = {
        message: "Great! Now tell us about your professional background.",
        ask: {
          fields: [
            { key: 'role', label: 'Current Role', type: 'select', options: ROLES },
            { key: 'industries', label: 'Industries', type: 'multi-select', options: INDUSTRIES, max: 3 }
          ],
          cta: 'Continue'
        },
        nextState: 'PROFESSIONAL'
      }
    } else {
      ai = { 
        message: "Let's start with your basic identity.", 
        ask: {
          fields: [
            { key: 'first_name', label: 'First Name', type: 'text', placeholder: 'Your first name' },
            { key: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Your last name' }
          ],
          cta: 'Continue'
        },
        nextState: 'IDENTITY' 
      }
    }
  } else if (stage === 'PROFESSIONAL') {
    if (input.formData && Object.keys(input.formData).length) {
      ai = {
        message: "Excellent! What are your networking goals?",
        ask: {
          fields: [
            { key: 'networking_goals', label: 'Networking Goals', type: 'multi-select', options: NETWORKING_GOALS, max: 4 },
            { key: 'connection_preferences', label: 'Who You Want to Meet', type: 'multi-select', options: CONNECTION_PREFERENCES, max: 4 }
          ],
          cta: 'Continue'
        },
        nextState: 'GOALS'
      }
    } else {
      ai = {
        message: "Tell us about your professional background.",
        ask: {
          fields: [
            { key: 'role', label: 'Current Role', type: 'select', options: ROLES },
            { key: 'industries', label: 'Industries', type: 'multi-select', options: INDUSTRIES, max: 3 }
          ],
          cta: 'Continue'
        },
        nextState: 'PROFESSIONAL'
      }
    }
  } else if (stage === 'GOALS') {
    if (input.formData && Object.keys(input.formData).length) {
      ai = {
        message: "Almost done! Add some personal touches to your profile.",
        ask: {
          fields: [
            { key: 'bio', label: 'Short Bio (optional)', type: 'text', placeholder: 'Tell us about yourself in a few words...' },
            { key: 'skills', label: 'Skills & Interests', type: 'multi-select', options: SKILLS, max: 8 },
            { key: 'linkedin_url', label: 'LinkedIn URL (optional)', type: 'url', placeholder: 'https://linkedin.com/in/yourname' }
          ],
          cta: 'Finish Profile'
        },
        nextState: 'PERSONALIZATION'
      }
    } else {
      ai = {
        message: "What are your networking goals?",
        ask: {
          fields: [
            { key: 'networking_goals', label: 'Networking Goals', type: 'multi-select', options: NETWORKING_GOALS, max: 4 },
            { key: 'connection_preferences', label: 'Who You Want to Meet', type: 'multi-select', options: CONNECTION_PREFERENCES, max: 4 }
          ],
          cta: 'Continue'
        },
        nextState: 'GOALS'
      }
    }
  } else if (stage === 'PERSONALIZATION') {
    if (input.formData && Object.keys(input.formData).length) {
      ai = {
        message: "🎉 Your profile is complete! You're ready to start making meaningful connections.",
        quickReplies: ['View My Profile', 'Start Networking'],
        nextState: 'DONE'
      }
    } else {
      ai = {
        message: "Almost done! Add some personal touches to your profile.",
        ask: {
          fields: [
            { key: 'bio', label: 'Short Bio (optional)', type: 'text', placeholder: 'Tell us about yourself in a few words...' },
            { key: 'skills', label: 'Skills & Interests', type: 'multi-select', options: SKILLS, max: 8 },
            { key: 'linkedin_url', label: 'LinkedIn URL (optional)', type: 'url', placeholder: 'https://linkedin.com/in/yourname' }
          ],
          cta: 'Finish Profile'
        },
        nextState: 'PERSONALIZATION'
      }
    }
  } else {
    ai = { 
      message: "Welcome to NuConnect! Let's create your networking profile in just a few quick steps.", 
      quickReplies: ['Get Started', 'Tell me more'], 
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

  // Only save basic stage info - no transcript or non-existent columns
  const update: any = { 
    user_id: user.id,
    onboarding_stage: ai.nextState === 'DONE' ? 'complete' : 'in_progress',
    updated_at: new Date().toISOString()
  }
  
  console.log('🔍 DEBUG: Final update data:', JSON.stringify(update, null, 2))
  console.log('🔍 DEBUG: AI next state:', ai.nextState)
  
  // Use upsert to ensure profile exists
  const { data: finalData, error: finalUpdateError } = await sb
    .from('profiles')
    .upsert(update)
    .select()
    .single()
  
  if (finalUpdateError) {
    console.error('❌ Final profile update error:', finalUpdateError)
    console.error('❌ Full final error object:', JSON.stringify(finalUpdateError, null, 2))
  } else {
    console.log('✅ Final profile update successful!')
    console.log('✅ Final profile data:', JSON.stringify(finalData, null, 2))
  }

  return NextResponse.json(ai)
}
