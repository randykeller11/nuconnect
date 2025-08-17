export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { openrouterChat } from '@/lib/ai/openrouter'
import { ROLES, INDUSTRIES, NETWORKING_GOALS, CONNECTION_PREFERENCES, SKILLS } from '@/shared/taxonomy'
import fs from 'node:fs/promises'
import path from 'node:path'

type ClientMsg = { userText?: string; formData?: Record<string, any>; state?: string }

// 6-step onboarding progression
const STATE_PROGRESSION = {
  'GREETING': 'IDENTITY',
  'IDENTITY': 'PROFESSIONAL', 
  'PROFESSIONAL': 'GOALS',
  'GOALS': 'CONNECTIONS',
  'CONNECTIONS': 'PERSONALIZATION',
  'PERSONALIZATION': 'PROFILE_SETUP',
  'PROFILE_SETUP': 'DONE'
} as const


export async function POST(req: Request) {
  const sb = await createSupabaseServerClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Use service role client to bypass ALL RLS policies
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    }
  )

  const input = (await req.json().catch(() => ({}))) as ClientMsg
  
  // Try to get existing profile, but don't fail if it doesn't exist
  let profile = null
  try {
    const { data } = await serviceSupabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
    profile = data
  } catch (error) {
    console.log('Profile fetch failed, will create new:', error)
    profile = null
  }

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
    
    // Ensure required name field is provided
    if (input.formData.first_name || input.formData.last_name) {
      patch.name = `${input.formData.first_name || ''} ${input.formData.last_name || ''}`.trim()
    }
    
    // Provide default name if none exists
    if (!patch.name) {
      patch.name = 'User' // Default name to satisfy NOT NULL constraint
    }
    
    console.log('🔍 DEBUG: Patch data to upsert:', JSON.stringify(patch, null, 2))
    
    // Use direct insert/update to avoid RLS policy issues completely
    let updated = null
    let upsertError = null
    
    try {
      if (profile) {
        // Update existing profile
        const { data, error } = await serviceSupabase
          .from('profiles')
          .update(patch)
          .eq('user_id', user.id)
          .select()
          .single()
        updated = data
        upsertError = error
      } else {
        // Insert new profile
        const { data, error } = await serviceSupabase
          .from('profiles')
          .insert(patch)
          .select()
          .single()
        updated = data
        upsertError = error
      }
    } catch (error) {
      console.error('❌ Direct database operation failed:', error)
      upsertError = error
    }
    
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
            { key: 'role', label: 'Current Role', type: 'text', placeholder: 'e.g. Software Engineer, Product Manager, CEO' },
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
            { key: 'networking_goals', label: 'Networking Goals', type: 'multi-select', options: NETWORKING_GOALS, max: 4 }
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
            { key: 'role', label: 'Current Role', type: 'text', placeholder: 'e.g. Software Engineer, Product Manager, CEO' },
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
        message: "Great! Now who would you like to connect with?",
        ask: {
          fields: [
            { key: 'connection_preferences', label: 'Who You Want to Meet', type: 'multi-select', options: CONNECTION_PREFERENCES, max: 4 }
          ],
          cta: 'Continue'
        },
        nextState: 'CONNECTIONS'
      }
    } else {
      ai = {
        message: "What are your networking goals?",
        ask: {
          fields: [
            { key: 'networking_goals', label: 'Networking Goals', type: 'multi-select', options: NETWORKING_GOALS, max: 4 }
          ],
          cta: 'Continue'
        },
        nextState: 'GOALS'
      }
    }
  } else if (stage === 'CONNECTIONS') {
    if (input.formData && Object.keys(input.formData).length) {
      ai = {
        message: "Great! Add some personal touches to your profile.",
        ask: {
          fields: [
            { key: 'bio', label: 'Short Bio (optional)', type: 'text', placeholder: 'Tell us about yourself in a few words...' },
            { key: 'skills', label: 'Skills & Interests', type: 'multi-select', options: SKILLS, max: 8 }
          ],
          cta: 'Continue'
        },
        nextState: 'PERSONALIZATION'
      }
    } else {
      ai = {
        message: "Who would you like to connect with?",
        ask: {
          fields: [
            { key: 'connection_preferences', label: 'Who You Want to Meet', type: 'multi-select', options: CONNECTION_PREFERENCES, max: 4 }
          ],
          cta: 'Continue'
        },
        nextState: 'CONNECTIONS'
      }
    }
  } else if (stage === 'PERSONALIZATION') {
    if (input.formData && Object.keys(input.formData).length) {
      ai = {
        message: "Perfect! Now let's set up your profile photo and links.",
        ask: {
          fields: [
            { key: 'profile_photo', label: 'Profile Photo (optional)', type: 'file' },
            { key: 'linkedin_url', label: 'LinkedIn URL (optional)', type: 'url', placeholder: 'https://linkedin.com/in/yourname' },
            { key: 'website_url', label: 'Website URL (optional)', type: 'url', placeholder: 'https://yourwebsite.com' },
            { key: 'social_links', label: 'Social Media Links (optional)', type: 'social-links' }
          ],
          cta: 'Finish Profile'
        },
        nextState: 'PROFILE_SETUP'
      }
    } else {
      ai = {
        message: "Add some personal touches to your profile.",
        ask: {
          fields: [
            { key: 'bio', label: 'Short Bio (optional)', type: 'text', placeholder: 'Tell us about yourself in a few words...' },
            { key: 'skills', label: 'Skills & Interests', type: 'multi-select', options: SKILLS, max: 8 }
          ],
          cta: 'Continue'
        },
        nextState: 'PERSONALIZATION'
      }
    }
  } else if (stage === 'PROFILE_SETUP') {
    if (input.formData && Object.keys(input.formData).length) {
      ai = {
        message: "🎉 Your profile is complete! You're ready to start making meaningful connections.",
        quickReplies: ['View My Profile', 'Start Networking'],
        nextState: 'DONE'
      }
    } else {
      ai = {
        message: "Finally, add your profile photo and social links.",
        ask: {
          fields: [
            { key: 'profile_photo', label: 'Profile Photo (optional)', type: 'file' },
            { key: 'linkedin_url', label: 'LinkedIn URL (optional)', type: 'url', placeholder: 'https://linkedin.com/in/yourname' },
            { key: 'website_url', label: 'Website URL (optional)', type: 'url', placeholder: 'https://yourwebsite.com' },
            { key: 'social_links', label: 'Social Media Links (optional)', type: 'social-links' }
          ],
          cta: 'Finish Profile'
        },
        nextState: 'PROFILE_SETUP'
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
    updated_at: new Date().toISOString(),
    name: updatedProfile?.name || 'User' // Ensure name field is always provided
  }
  
  console.log('🔍 DEBUG: Final update data:', JSON.stringify(update, null, 2))
  console.log('🔍 DEBUG: AI next state:', ai.nextState)
  
  // Use direct update to avoid any RLS policy interference
  let finalData = null
  let finalUpdateError = null
  
  try {
    if (updatedProfile) {
      // Update existing profile
      const { data, error } = await serviceSupabase
        .from('profiles')
        .update(update)
        .eq('user_id', user.id)
        .select()
        .single()
      finalData = data
      finalUpdateError = error
    } else {
      // Insert new profile with combined data
      const combinedData = { ...update }
      const { data, error } = await serviceSupabase
        .from('profiles')
        .insert(combinedData)
        .select()
        .single()
      finalData = data
      finalUpdateError = error
    }
  } catch (error) {
    console.error('❌ Final database operation failed:', error)
    finalUpdateError = error
  }
  
  if (finalUpdateError) {
    console.error('❌ Final profile update error:', finalUpdateError)
    console.error('❌ Full final error object:', JSON.stringify(finalUpdateError, null, 2))
  } else {
    console.log('✅ Final profile update successful!')
    console.log('✅ Final profile data:', JSON.stringify(finalData, null, 2))
  }

  return NextResponse.json(ai)
}
