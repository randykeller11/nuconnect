import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { toUserId, roomId } = await req.json()

  // Check if we already sent a request to this user
  const { data: existingShare } = await supabase
    .from('contact_shares')
    .select('*')
    .eq('from_user_id', user.id)
    .eq('to_user_id', toUserId)
    .maybeSingle()

  if (existingShare) {
    return NextResponse.json({ 
      message: 'Already sent', 
      mutual: existingShare.status === 'mutual' 
    })
  }

  // Check if they already sent us a request
  const { data: reverseShare } = await supabase
    .from('contact_shares')
    .select('*')
    .eq('from_user_id', toUserId)
    .eq('to_user_id', user.id)
    .maybeSingle()

  const isMutual = !!reverseShare

  // Insert our share request
  const { error: insertError } = await supabase
    .from('contact_shares')
    .insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      room_id: roomId,
      status: isMutual ? 'mutual' : 'sent'
    })

  if (insertError) {
    console.error('Error inserting contact share:', insertError)
    return NextResponse.json({ error: 'Failed to share contact' }, { status: 500 })
  }

  // If mutual, update the reverse share to mutual as well
  if (isMutual && reverseShare) {
    await supabase
      .from('contact_shares')
      .update({ status: 'mutual' })
      .eq('id', reverseShare.id)
  }

  return NextResponse.json({ 
    message: isMutual ? "It's a match! Contact info exchanged." : 'Contact info shared. We\'ll notify you if they share back.',
    mutual: isMutual 
  })
}
