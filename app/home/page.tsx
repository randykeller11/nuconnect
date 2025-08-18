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
    <div className="min-h-screen bg-aulait">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <WelcomeHero 
            name={profile.first_name || profile.name || 'Friend'} 
            ctaHref="/events"
            profilePhotoUrl={profile.profile_photo_url}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileStrengthCard 
              strength={strength} 
            />
            <EventsCard events={eventsWithRooms} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Focus & Intent Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h3 className="text-lg font-semibold text-inkwell mb-3">Focus & Intent</h3>
              <div className="space-y-3">
                {profile.industries?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-lunar mb-1">Industries</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.industries.map((industry: string) => (
                        <span key={industry} className="px-2 py-1 bg-inkwell/10 text-inkwell rounded-full text-xs">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.skills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-lunar mb-1">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-lunar/10 text-lunar rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.networking_goals?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-lunar mb-1">Networking Goals</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.networking_goals.map((goal: string) => (
                        <span key={goal} className="px-2 py-1 bg-creme/50 text-inkwell rounded-full text-xs">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h3 className="text-lg font-semibold text-inkwell mb-3">Why NuConnect?</h3>
              <p className="text-lunar text-sm leading-relaxed">
                NuConnect helps you build meaningful professional relationships through intelligent matching 
                based on shared interests, complementary skills, and aligned networking goals. Join focused 
                rooms, discover quality connections, and grow your network with purpose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
