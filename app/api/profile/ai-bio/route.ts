export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { openrouterChat } from '@/lib/ai/openrouter'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function POST() {
  const sb = await createSupabaseServerClient()
  const { data:{ user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status:401 })

  const { data: p } = await sb.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
  if (!p) return NextResponse.json({ error:'profile not found' }, { status:404 })

  const tmplPath = path.join(process.cwd(), 'prompts', 'bio.md')
  const tmpl = await fs.readFile(tmplPath, 'utf8').catch(()=>'')

  const filled =
    tmpl.replace('{name}', p.name ?? '')
        .replace('{role}', p.role ?? '')
        .replace('{company}', p.company ?? '')
        .replace('{headline}', p.headline ?? '')
        .replace('{industries[]}', JSON.stringify(p.industries ?? []))
        .replace('{skills[]}', JSON.stringify(p.skills ?? []))
        .replace('{objectives[]}', JSON.stringify(p.objectives ?? []))
        .replace('{seeking[]}', JSON.stringify(p.seeking ?? []))

  const content = await openrouterChat([{ role:'user', content: filled }], 'openai/gpt-4o-mini', 0.3)
  const bio = (content || '').trim().slice(0, 280)

  await sb.from('profiles').update({ ai_bio: bio, updated_at: new Date().toISOString() }).eq('user_id', user.id)
  return NextResponse.json({ bio })
}
