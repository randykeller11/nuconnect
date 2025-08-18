import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'
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
            <h1 className="text-3xl font-bold text-gray-800">Events</h1>
          </div>

          {events?.length === 0 ? (
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-lunar">No events available at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {events?.map((event) => (
                <Card key={event.id} className="bg-white rounded-2xl shadow-sm border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-2xl font-semibold text-gray-800">
                          {event.name}
                        </CardTitle>
                        
                        <div className="flex items-center gap-4 text-lunar">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(event.starts_at)}
                          </div>
                          {event.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.city}
                            </div>
                          )}
                          {event.participants_count && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.participants_count} expected
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link href={`/events/${event.id}`}>
                        <Button>View Details</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  
                  {event.summary && (
                    <CardContent>
                      <p className="text-lunar">{event.summary}</p>
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
