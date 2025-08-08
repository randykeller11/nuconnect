import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching questionnaire responses with user data from Supabase...');
    
    // Fetch questionnaire responses with user data using a join
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/questionnaire_responses?select=*,users(id,first_name,last_name,email,phone,relationship_status)&order=submitted_at.desc`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase API error:', response.status, errorText);
      throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw Supabase data with users:', data);
    
    // Transform the data to match the expected format
    const transformedData = data.map((item: any) => {
      // Convert answers object to array format expected by the frontend
      const answersArray = [];
      if (item.answers && typeof item.answers === 'object') {
        for (const [key, value] of Object.entries(item.answers)) {
          // Create a readable question text from the key
          const questionText = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          answersArray.push({
            questionId: key,
            question: questionText,
            answer: value
          });
        }
      }

      return {
        id: item.id,
        userId: item.user_id,
        answers: answersArray,
        isComplete: item.is_complete || false,
        submittedAt: item.submitted_at,
        updatedAt: item.updated_at || item.submitted_at,
        user: item.users ? {
          id: item.users.id,
          firstName: item.users.first_name,
          lastName: item.users.last_name,
          email: item.users.email,
          phone: item.users.phone,
          relationshipStatus: item.users.relationship_status
        } : null
      };
    });

    console.log('Transformed data with users:', transformedData);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching questionnaire responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire responses' },
      { status: 500 }
    );
  }
}
