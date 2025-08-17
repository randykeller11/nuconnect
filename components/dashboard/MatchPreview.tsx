'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrimaryButton } from '@/components/PrimaryButton'
import { useRouter } from 'next/navigation'

export type MatchPreview = {
  user_id: string
  name: string
  headline?: string
  avatar?: string
  score: number
  shared?: { interests?: string[]; skills?: string[] }
}

interface MatchPreviewProps {
  items: MatchPreview[]
}

export default function MatchPreview({ items }: MatchPreviewProps) {
  const router = useRouter()
  if (!items.length) {
    return (
      <Card className="bg-white shadow-xl border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-inkwell">Recommended Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lunar mb-4">Join a room to see potential matches</p>
          <PrimaryButton onClick={() => router.push('/rooms')} size="default">
            Browse Rooms
          </PrimaryButton>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-xl border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-inkwell">Recommended Matches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.slice(0, 3).map((match) => (
          <div key={match.user_id} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-inkwell/10 rounded-full flex items-center justify-center">
              {match.avatar ? (
                <img src={match.avatar} alt={match.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <span className="text-inkwell font-medium">
                  {match.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-inkwell truncate">{match.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {match.score}%
                </Badge>
              </div>
              <p className="text-sm text-lunar truncate">{match.headline}</p>
              <div className="flex gap-1 mt-1">
                {match.shared?.interests?.slice(0, 2).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {match.shared?.skills?.slice(0, 1).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
        <PrimaryButton onClick={() => router.push('/rooms')} className="w-full mt-4">
          View All Matches
        </PrimaryButton>
      </CardContent>
    </Card>
  )
}
