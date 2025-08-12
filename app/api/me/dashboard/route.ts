import { createSupabaseServerClient } from '@/lib/supabase/server'
import { calculateProfileStrength } from '@/lib/profile/strength'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Skip Supabase calls during build
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        profileStrength: { score: 0, level: 'Basic', suggestions: [], breakdown: {} },
        upcomingRooms: [],
        recentConnections: [],
        user: null
      })
    }

    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Calculate profile strength
    const profileStrength = profile ? calculateProfileStrength(profile) : {
      score: 0,
      level: 'Basic' as const,
      suggestions: ['Complete your profile to get started'],
      breakdown: { avatar: 0, headline: 0, basics: 0, skills: 0, links: 0 }
    }

    // Mock upcoming rooms (in real app, query from database)
    const upcomingRooms = [
      {
        id: 'room-1',
        name: 'AI Enthusiasts',
        description: 'Connect with professionals working on AI and machine learning projects',
        memberCount: 24,
        isLive: true,
        location: 'San Francisco',
        tags: ['AI', 'Machine Learning', 'Tech']
      },
      {
        id: 'room-2',
        name: 'Startup Founders',
        description: 'Network with fellow entrepreneurs and startup founders',
        memberCount: 18,
        isLive: false,
        location: 'Remote',
        tags: ['Startups', 'Entrepreneurship', 'Funding']
      },
      {
        id: 'room-3',
        name: 'Climate Tech',
        description: 'Professionals working on climate solutions and sustainability',
        memberCount: 15,
        isLive: true,
        location: 'New York',
        tags: ['Climate', 'Sustainability', 'GreenTech']
      }
    ]

    // Mock recent connections (in real app, query from database)
    const recentConnections = [
      {
        id: 'conn-1',
        name: 'Sarah Chen',
        headline: 'Product Manager at TechCorp',
        company: 'TechCorp',
        sharedTopics: ['AI', 'Product Management'],
        matchScore: 0.92,
        lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isStarred: true
      },
      {
        id: 'conn-2',
        name: 'Michael Rodriguez',
        headline: 'Senior Software Engineer',
        company: 'StartupCo',
        sharedTopics: ['JavaScript', 'React', 'Node.js'],
        matchScore: 0.87,
        lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        id: 'conn-3',
        name: 'Emily Johnson',
        headline: 'Climate Tech Investor',
        company: 'GreenVentures',
        sharedTopics: ['Climate Tech', 'Investing'],
        matchScore: 0.83,
        lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      }
    ]

    return NextResponse.json({
      profileStrength,
      upcomingRooms,
      recentConnections,
      user: {
        name: profile?.name,
        profile_photo_url: profile?.profile_photo_url,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
