import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { insertContactShareSchema } from '../../../../../shared/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { userId, contactInfo } = body
    const resolvedParams = await params
    const matchId = resolvedParams.id
    
    if (!userId || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing userId or contactInfo' },
        { status: 400 }
      )
    }
    
    // Validate contact share data
    const shareData = insertContactShareSchema.parse({
      match_id: matchId,
      user_id: userId,
      payload: contactInfo
    })
    
    // Store contact share
    const { data: contactShare, error } = await supabase
      .from('contact_shares')
      .upsert(shareData, {
        onConflict: 'match_id,user_id'
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    // Check if both users have shared contact info
    const { data: allShares, error: sharesError } = await supabase
      .from('contact_shares')
      .select('*')
      .eq('match_id', matchId)
    
    if (sharesError) {
      throw new Error(`Failed to check mutual shares: ${sharesError.message}`)
    }
    
    const isMutual = allShares && allShares.length >= 2
    
    return NextResponse.json({
      success: true,
      contactShare,
      isMutual,
      mutualContacts: isMutual ? allShares : null
    })
  } catch (error) {
    console.error('Error sharing contact:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid contact share data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to share contact' },
      { status: 500 }
    )
  }
}
