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
      <CardContent className="p-4">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-lunar">Completeness</span>
            <span className="text-lg font-bold text-inkwell">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-inkwell to-lunar h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-lunar mb-3">{suggestion}</p>
        <PrimaryButton onClick={() => router.push('/profile/edit')} className="w-full">
          {percentage >= 100 ? 'Edit Profile' : 'Improve Profile'}
        </PrimaryButton>
      </CardContent>
    </Card>
  )
}
