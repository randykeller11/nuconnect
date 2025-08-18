'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface HomeHeroProps {
  user?: {
    name?: string
    profile_photo_url?: string
    email?: string
  }
}

export default function HomeHero({ user }: HomeHeroProps) {
  const router = useRouter()

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center mb-6">
        {user?.profile_photo_url ? (
          <img 
            src={user.profile_photo_url} 
            alt={user.name || 'Profile'} 
            className="w-16 h-16 rounded-full object-cover border-2 border-aulait"
          />
        ) : (
          <div className="w-16 h-16 bg-inkwell/10 rounded-full flex items-center justify-center">
            <span className="text-inkwell font-bold text-xl">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </span>
          </div>
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-inkwell">
        Welcome back, {user?.name || 'there'}!
      </h1>
      
      <p className="text-lunar text-lg max-w-2xl mx-auto">
        Discover meaningful connections through events and focused networking rooms.
      </p>
      
      <div className="flex gap-4 justify-center mt-6">
        <Button
          onClick={() => router.push('/events')}
          className="bg-inkwell text-aulait hover:bg-lunar"
        >
          Browse Events
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/profile/edit')}
          className="border-lunar text-lunar hover:bg-lunar hover:text-white"
        >
          Update Profile
        </Button>
      </div>
    </div>
  )
}
