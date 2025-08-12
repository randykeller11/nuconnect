'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { ProfileStrengthResult } from '@/lib/profile/strength'

interface ProfileStrengthCardProps {
  strength: ProfileStrengthResult
}

export function ProfileStrengthCard({ strength }: ProfileStrengthCardProps) {
  const router = useRouter()

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Elite': return 'bg-green-500'
      case 'Great': return 'bg-blue-500'
      case 'Solid': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelTextColor = (level: string) => {
    switch (level) {
      case 'Elite': return 'text-green-700'
      case 'Great': return 'text-blue-700'
      case 'Solid': return 'text-yellow-700'
      default: return 'text-gray-700'
    }
  }

  return (
    <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-inkwell flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Profile Strength
          </CardTitle>
          <Badge 
            className={`${getLevelColor(strength.level)} text-white`}
          >
            {strength.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-lunar">Completion</span>
            <span className={`text-lg font-bold ${getLevelTextColor(strength.level)}`}>
              {strength.score}%
            </span>
          </div>
          <Progress value={strength.score} className="h-3" />
        </div>

        {strength.suggestions.length > 0 && (
          <div>
            <h4 className="font-medium text-inkwell mb-3">Quick Improvements</h4>
            <div className="space-y-2">
              {strength.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-lunar">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-creme flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => router.push('/profile/edit')}
          className="w-full bg-gradient-to-r from-inkwell to-lunar hover:from-lunar hover:to-inkwell text-aulait"
        >
          Boost Your Profile
        </Button>
      </CardContent>
    </Card>
  )
}
