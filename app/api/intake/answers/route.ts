import { NextRequest, NextResponse } from 'next/server'
import { intakeStateMachine } from '../../../../lib/pipeline/stateMachine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, answer } = body
    
    if (!userId || answer === undefined) {
      return NextResponse.json(
        { error: 'Missing userId or answer' },
        { status: 400 }
      )
    }
    
    const result = await intakeStateMachine.processAnswer(userId, answer)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      nextQuestion: result.nextQuestion,
      isComplete: result.isComplete
    })
  } catch (error) {
    console.error('Error processing answer:', error)
    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    )
  }
}
