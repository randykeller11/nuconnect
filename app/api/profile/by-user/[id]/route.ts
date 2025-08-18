import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const sb = await createSupabaseServerClient()
    
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('user_id', params.id)
      .single()
    
    if (error || !data) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    
    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error('Unexpected error in /api/profile/by-user/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
