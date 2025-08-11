import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { insertBoostTransactionSchema } from '../../../shared/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }
    
    // Get user's active boosts
    const { data: boosts, error } = await supabase
      .from('boost_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    return NextResponse.json({ boosts })
  } catch (error) {
    console.error('Error fetching boosts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch boosts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = insertBoostTransactionSchema.parse(body)
    
    // Create boost transaction (stubbed for demo)
    const { data: boost, error } = await supabase
      .from('boost_transactions')
      .insert({
        ...validatedData,
        status: 'active' // For demo purposes
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    return NextResponse.json(boost, { status: 201 })
  } catch (error) {
    console.error('Error creating boost:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid boost data provided' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create boost' },
      { status: 500 }
    )
  }
}
