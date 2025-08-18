import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await supabaseServer()
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error in /api/profile/by-user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
