import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function EventsPage() {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch all events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: true })

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/home">
                <Button variant="ghost" size="sm" className="text-lunar hover:text-inkwell">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Events</h1>
            </div>
          </div>

          {events?.length === 0 ? (
            <Card className="bg-white rounded-2xl shadow-md border">
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-lunar/10 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="w-8 h-8 text-lunar" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">No Events Yet</h3>
                  <p className="text-lunar">Check back soon for upcoming networking events and opportunities.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {events?.map((event) => (
                <Card key={event.id} className="bg-white rounded-2xl shadow-md border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <CardTitle className="text-2xl font-bold text-gray-800">
                          {event.name}
                        </CardTitle>
                        
                        <div className="flex flex-wrap items-center gap-4 text-lunar">
                          <div className="flex items-center gap-2 bg-aulait/20 px-3 py-1 rounded-full">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatDate(event.starts_at)}</span>
                          </div>
                          {event.city && (
                            <div className="flex items-center gap-2 bg-aulait/20 px-3 py-1 rounded-full">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm font-medium">{event.city}</span>
                            </div>
                          )}
                          {event.participants_count && (
                            <div className="flex items-center gap-2 bg-aulait/20 px-3 py-1 rounded-full">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">{event.participants_count} expected</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link href={`/events/${event.id}`}>
                        <Button className="bg-inkwell hover:bg-inkwell/90 text-white px-6 py-2 rounded-full">
                          View Details →
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  
                  {event.summary && (
                    <CardContent className="pt-0">
                      <div className="bg-aulait/10 rounded-lg p-4">
                        <p className="text-lunar leading-relaxed">{event.summary}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
