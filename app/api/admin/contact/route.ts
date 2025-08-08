import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/contact_submissions?select=*&order=submitted_at.desc`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact submissions');
    }

    const data = await response.json();
    
    // Transform the data to match the expected format
    const transformedData = data.map((item: any) => ({
      id: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      phone: item.phone,
      relationshipStatus: item.relationship_status,
      message: item.message,
      submittedAt: item.submitted_at,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}
