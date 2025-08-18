'use client'
import { PrimaryButton } from '@/components/PrimaryButton'
import Image from 'next/image'

interface WelcomeHeroProps {
  name: string
  ctaHref: string
  profilePhotoUrl?: string | null
}

export default function WelcomeHero({ name, ctaHref, profilePhotoUrl }: WelcomeHeroProps) {
  return (
    <div className="bg-gradient-to-r from-inkwell to-lunar rounded-2xl p-6 text-aulait">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {profilePhotoUrl && (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-aulait/20 flex-shrink-0">
              <Image
                src={profilePhotoUrl}
                alt={`${name}'s profile`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {name}!</h1>
            <p className="text-aulait/80">Ready to make meaningful connections today?</p>
          </div>
        </div>
        <PrimaryButton 
          onClick={() => window.location.assign(ctaHref)}
          className="bg-aulait text-inkwell hover:bg-aulait/90 flex-shrink-0"
        >
          Browse Events
        </PrimaryButton>
      </div>
    </div>
  )
}
