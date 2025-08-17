import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'
import { loginUserSchema } from '../../../../shared/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = loginUserSchema.parse(body)
    
    // This is a legacy auth route - the app now uses Supabase auth
    return NextResponse.json(
      { error: 'Legacy auth method no longer supported. Please use Supabase auth.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error logging in user:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid login data provided' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
