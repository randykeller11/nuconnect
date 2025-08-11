import { NextRequest, NextResponse } from 'next/server'
import { intakeStateMachine } from '../../../../lib/pipeline/stateMachine'

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
    
    const question = await intakeStateMachine.getNextQuestion(userId)
    
    if (!question) {
      return NextResponse.json(
        { message: 'Intake complete', isComplete: true },
        { status: 200 }
      )
    }
    
    return NextResponse.json({ question })
  } catch (error) {
    console.error('Error getting next question:', error)
    return NextResponse.json(
      { error: 'Failed to get next question' },
      { status: 500 }
    )
  }
}
