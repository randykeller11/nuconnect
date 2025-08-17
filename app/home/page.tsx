import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WelcomeHero from '@/components/dashboard/WelcomeHero'
import MatchPreview from '@/components/dashboard/MatchPreview'
import RoomsList from '@/components/dashboard/RoomsList'
import ProfileStrengthCard from '@/components/dashboard/ProfileStrengthCard'
import DashboardClient from './DashboardClient'

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

  // Fetch active rooms
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_public', true)
    .order('member_count', { ascending: false })
    .limit(3)

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

  // Preview matches (empty for now - will be populated when user joins rooms)
  const previewMatches: any[] = []

  return (
    <div className="min-h-screen bg-aulait">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <WelcomeHero 
            name={profile.first_name || profile.name || 'Friend'} 
            ctaHref="/rooms" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MatchPreview 
              items={previewMatches} 
              onOpenDeck={() => {}} 
            />
            <DashboardClient rooms={rooms || []} />
            <ProfileStrengthCard 
              strength={strength} 
              onImprove={() => {}} 
            />
          </div>

          {/* Focus & Intent Section */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-inkwell mb-4">Focus & Intent</h3>
            <div className="space-y-4">
              {profile.industries?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-lunar mb-2">Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.industries.map((industry: string) => (
                      <span key={industry} className="px-3 py-1 bg-inkwell/10 text-inkwell rounded-full text-sm">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-lunar mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-lunar/10 text-lunar rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.networking_goals?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-lunar mb-2">Networking Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.networking_goals.map((goal: string) => (
                      <span key={goal} className="px-3 py-1 bg-creme/50 text-inkwell rounded-full text-sm">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-inkwell mb-3">Why NuConnect?</h3>
            <p className="text-lunar">
              NuConnect helps you build meaningful professional relationships through intelligent matching 
              based on shared interests, complementary skills, and aligned networking goals. Join focused 
              rooms, discover quality connections, and grow your network with purpose.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
