import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/professional_signups?select=*&order=submitted_at.desc`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch professional signups');
    }

    const data = await response.json();
    
    // Transform the data to match the expected format
    const transformedData = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      firm: item.firm,
      email: item.email,
      phone: item.phone,
      specialty: item.specialty,
      submittedAt: item.submitted_at,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching professional signups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch professional signups' },
      { status: 500 }
    );
  }
}
