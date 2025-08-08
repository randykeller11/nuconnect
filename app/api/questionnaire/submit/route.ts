import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../server/storage.js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, answers, isComplete = false } = body
    
    if (!userId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Save or update the questionnaire response using the storage layer
    const response = await storage.createOrUpdateQuestionnaireResponse(userId, answers, isComplete)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error saving questionnaire:', error)
    return NextResponse.json(
      { error: 'Failed to save questionnaire' },
      { status: 500 }
    )
  }
}
