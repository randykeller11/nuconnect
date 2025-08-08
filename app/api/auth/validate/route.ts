import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }
    
    // Try to find the user by ID using the storage layer
    const user = await storage.getUserById(userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error validating user:', error)
    return NextResponse.json(
      { error: 'Failed to validate user' },
      { status: 500 }
    )
  }
}
