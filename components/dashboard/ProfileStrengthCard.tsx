'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrimaryButton } from '@/components/PrimaryButton'
import { useRouter } from 'next/navigation'

export type ProfileStrengthResult = {
  score: number
  maxScore: number
  suggestions: string[]
}

interface ProfileStrengthCardProps {
  strength: ProfileStrengthResult | null
}

export default function ProfileStrengthCard({ strength }: ProfileStrengthCardProps) {
  const router = useRouter()
  const score = strength?.score ?? 0
  const maxScore = strength?.maxScore ?? 100
  const percentage = Math.round((score / maxScore) * 100)
  const suggestion = strength?.suggestions?.[0] ?? 'Complete your profile'

  return (
    <Card className="bg-white shadow-md border rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">Profile Strength</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-lunar">Completeness</span>
            <span className="text-sm font-medium text-inkwell">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-inkwell to-lunar h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-lunar mb-2">{suggestion}</p>
        <PrimaryButton onClick={() => router.push('/profile/edit')} size="sm" className="w-full">
          Improve Profile
        </PrimaryButton>
      </CardContent>
    </Card>
  )
}
