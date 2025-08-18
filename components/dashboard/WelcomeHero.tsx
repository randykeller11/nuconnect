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
    <div className="bg-gradient-to-r from-inkwell to-lunar rounded-2xl p-4 text-aulait">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profilePhotoUrl && (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-aulait/20 flex-shrink-0">
              <Image
                src={profilePhotoUrl}
                alt={`${name}'s profile`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold mb-0">Welcome back, {name}!</h1>
            <p className="text-aulait/80 text-sm">Ready to make meaningful connections today?</p>
          </div>
        </div>
        <PrimaryButton 
          onClick={() => window.location.assign(ctaHref)}
          className="bg-aulait text-inkwell hover:bg-aulait/90 flex-shrink-0"
          size="sm"
        >
          Browse Events
        </PrimaryButton>
      </div>
    </div>
  )
}
