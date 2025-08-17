'use client'
import { PrimaryButton } from '@/components/PrimaryButton'

interface WelcomeHeroProps {
  name: string
  ctaHref: string
}

export default function WelcomeHero({ name, ctaHref }: WelcomeHeroProps) {
  return (
    <div className="bg-gradient-to-r from-inkwell to-lunar rounded-2xl p-8 text-aulait">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {name}!</h1>
      <p className="text-aulait/80 mb-6">Ready to make meaningful connections today?</p>
      <PrimaryButton 
        onClick={() => window.location.assign(ctaHref)}
        className="bg-aulait text-inkwell hover:bg-aulait/90"
      >
        Find Matches
      </PrimaryButton>
    </div>
  )
}
