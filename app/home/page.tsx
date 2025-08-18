import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WelcomeHero from '@/components/dashboard/WelcomeHero'
import ProfileStrengthCard from '@/components/dashboard/ProfileStrengthCard'
import EventsCard from '@/components/dashboard/EventsCard'

export default async function HomePage() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Fetch events with rooms
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: true })
    .limit(3)

  let eventsWithRooms = []
  if (events?.length) {
    const { data: rooms } = await supabase
      .from('rooms')
      .select('*')
      .in('event_id', events.map(e => e.id))

    const roomsByEvent = new Map<string, any[]>()
    rooms?.forEach(r => {
      if (!r.event_id) return
      const arr = roomsByEvent.get(r.event_id) ?? []
      arr.push(r)
      roomsByEvent.set(r.event_id, arr)
    })

    eventsWithRooms = events.map(e => ({
      ...e,
      rooms: (roomsByEvent.get(e.id) ?? []).sort((a, b) => b.member_count - a.member_count)
    }))
  }

  // Calculate profile strength
  const strength = {
    score: 0,
    maxScore: 100,
    suggestions: ['Add more skills to your profile']
  }

  // Calculate score based on profile completeness
  let score = 0
  if (profile.first_name) score += 10
  if (profile.last_name) score += 10
  if (profile.bio) score += 15
  if (profile.role) score += 15
  if (profile.industries?.length) score += 15
  if (profile.skills?.length) score += 15
  if (profile.networking_goals?.length) score += 10
  if (profile.linkedin_url) score += 10

  strength.score = score

  // Generate suggestions
  const suggestions = []
  if (!profile.bio) suggestions.push('Add a bio to help others understand your background')
  if (!profile.industries?.length) suggestions.push('Add industries you work in')
  if (!profile.skills?.length) suggestions.push('Add your key skills')
  if (!profile.networking_goals?.length) suggestions.push('Set your networking goals')
  if (!profile.linkedin_url) suggestions.push('Connect your LinkedIn profile')

  strength.suggestions = suggestions.length ? suggestions : ['Your profile looks great!']

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <WelcomeHero 
            name={profile.first_name || profile.name || 'Friend'} 
            ctaHref="/events"
            profilePhotoUrl={profile.profile_photo_url}
          />
          
          {/* 3-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Upcoming Events */}
            <div className="lg:col-span-2">
              <div className="mb-3">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4">
                <EventsCard events={eventsWithRooms.slice(0, 3)} />
              </div>
            </div>

            {/* Column 2: Profile Strength & Actions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Profile Strength</h2>
                <ProfileStrengthCard strength={strength} />
              </div>
              
              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl p-4 shadow-md border">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <a 
                    href="/events"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm text-white bg-inkwell hover:bg-inkwell/90 rounded-full transition-colors"
                  >
                    Browse All Events →
                  </a>
                  <a 
                    href="/connections"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm text-white bg-lunar hover:bg-lunar/90 rounded-full transition-colors"
                  >
                    View Connections →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Focus & Intent Section */}
          <div className="bg-white rounded-2xl p-6 shadow-md border">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Professional Focus</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {profile.industries?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-lunar mb-2">Industries</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.industries.slice(0, 4).map((industry: string) => (
                      <span key={industry} className="px-2 py-1 bg-inkwell/10 text-inkwell rounded-full text-xs">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-lunar mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 4).map((skill: string) => (
                      <span key={skill} className="px-2 py-1 bg-lunar/10 text-lunar rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.networking_goals?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-lunar mb-2">Networking Goals</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.networking_goals.slice(0, 3).map((goal: string) => (
                      <span key={goal} className="px-2 py-1 bg-creme/50 text-inkwell rounded-full text-xs">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
