import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'
import { insertUserSchema } from '../../../../shared/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // This is a legacy auth route - the app now uses Supabase auth
    return NextResponse.json(
      { error: 'Legacy auth method no longer supported. Please use Supabase auth.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    
    return NextResponse.json(
      { error: 'Legacy auth method no longer supported. Please use Supabase auth.' },
      { status: 400 }
    )
  }
}
