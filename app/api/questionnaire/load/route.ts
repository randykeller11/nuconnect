import { NextRequest, NextResponse } from 'next/server'

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

    // Fetch questionnaire response from Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/questionnaire_responses?user_id=eq.${userId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Supabase')
    }

    const data = await response.json()
    
    if (data.length === 0) {
      return NextResponse.json({ 
        exists: false,
        answers: null,
        isComplete: false
      })
    }

    const questionnaireData = data[0]
    
    return NextResponse.json({
      exists: true,
      answers: questionnaireData.answers,
      isComplete: questionnaireData.is_complete || false,
      submittedAt: questionnaireData.submitted_at
    })

  } catch (error) {
    console.error('Error loading questionnaire:', error)
    return NextResponse.json(
      { error: 'Failed to load questionnaire data' },
      { status: 500 }
    )
  }
}
