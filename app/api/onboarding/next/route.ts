export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { openrouterChat } from '@/lib/ai/openrouter'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { INDUSTRIES, SKILLS, OBJECTIVES, SEEKING, SENIORITY } from '@/shared/taxonomy'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(req: Request) {
  const sb = await createSupabaseServerClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(()=>({}))
  // Load current profile
  const { data: profile } = await sb.from('profiles').select('*').eq('user_id', user.id).maybeSingle()

  const template = await readFile(join(process.cwd(), 'prompts/onboarding.md'), 'utf-8').catch(()=>'')

  const filled = template
    .replace('{name}', profile?.name ?? '')
    .replace('{role}', profile?.role ?? '')
    .replace('{company}', profile?.company ?? '')
    .replace('{headline}', profile?.headline ?? '')
    .replace('{industries[]}', JSON.stringify(profile?.industries ?? []))
    .replace('{skills[]}', JSON.stringify(profile?.skills ?? []))
    .replace('{interests[]}', JSON.stringify(profile?.interests ?? []))
    .replace('{objectives[]}', JSON.stringify(profile?.objectives ?? []))
    .replace('{seeking[]}', JSON.stringify(profile?.seeking ?? []))
    .replace('{seniority}', profile?.seniority ?? '')
    .replace('{context}', JSON.stringify(body?.context ?? {}))
    .replace('{INDUSTRIES[]}', JSON.stringify(INDUSTRIES))
    .replace('{SKILLS[]}', JSON.stringify(SKILLS))
    .replace('{OBJECTIVES[]}', JSON.stringify(OBJECTIVES))
    .replace('{SEEKING[]}', JSON.stringify(SEEKING))
    .replace('{SENIORITY[]}', JSON.stringify(SENIORITY))

  const content = await openrouterChat([
    { role:'system', content:'You reply in strict JSON only.' },
    { role:'user', content: filled }
  ])

  // Best-effort parse
  let json:any = {}
  try { json = JSON.parse(content) } catch { json = { question: 'Tell us your role', suggestedChoices: [], explanation: '' } }

  return NextResponse.json(json)
}
