import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'
import { insertUserSchema } from '../../../../shared/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = insertUserSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }
    
    // Create the user
    const user = await storage.createUser(validatedData)
    
    // Don't return password in response
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid user data provided' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
