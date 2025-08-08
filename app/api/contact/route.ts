import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import { insertContactSubmissionSchema } from '../../../shared/schema'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Get all contact submissions from database
    const submissions = await storage.getAllContactSubmissions()
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = insertContactSubmissionSchema.parse(body)
    
    // Create the contact submission in the database
    const submission = await storage.createContactSubmission(validatedData)
    
    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating contact submission:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid contact data provided' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create contact submission' },
      { status: 500 }
    )
  }
}
