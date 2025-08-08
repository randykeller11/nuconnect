import { NextRequest, NextResponse } from 'next/server'

// Mock data for demo purposes
const mockProfessionals = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@financialwellness.com',
    firm: 'Financial Wellness Partners',
    phone: '(555) 123-4567',
    specialty: 'Couples Financial Therapy',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'mchen@relationshipfinance.org',
    firm: 'Relationship Finance Institute',
    phone: '(555) 234-5678',
    specialty: 'Marriage and Financial Planning',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    email: 'emily@couplescoaching.net',
    firm: 'Couples Coaching Solutions',
    phone: '(555) 345-6789',
    specialty: 'Financial Communication Coaching',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'jwilson@familyfinancial.com',
    firm: 'Family Financial Advisors',
    phone: '(555) 456-7890',
    specialty: 'Family Financial Planning',
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  }
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(mockProfessionals)
  } catch (error) {
    console.error('Error fetching professional signups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch professional signups' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create new professional signup
    const newProfessional = {
      id: mockProfessionals.length + 1,
      ...body,
      submittedAt: new Date().toISOString()
    }
    
    // In a real app, this would save to a database
    mockProfessionals.push(newProfessional)
    
    return NextResponse.json(newProfessional, { status: 201 })
  } catch (error) {
    console.error('Error creating professional signup:', error)
    return NextResponse.json(
      { error: 'Failed to create professional signup' },
      { status: 500 }
    )
  }
}
