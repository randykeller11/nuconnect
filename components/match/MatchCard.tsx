'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PrimaryButton } from '@/components/PrimaryButton'
import { Button } from '@/components/ui/button'

export type MatchCardData = {
  user_id: string
  name: string
  headline?: string
  avatar?: string
  score: number
  shared?: { interests?: string[]; skills?: string[] }
  rationale: string
}

interface MatchCardProps {
  data: MatchCardData
  onShare: (userId: string) => Promise<void>
  onSkip: (userId: string) => void
}

export default function MatchCard({ data, onShare, onSkip }: MatchCardProps) {
  return (
    <Card className="bg-white shadow-xl border-0 rounded-2xl max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-inkwell/10 rounded-full flex items-center justify-center relative">
            {data.avatar ? (
              <img 
                src={data.avatar} 
                alt={data.name} 
                className="w-20 h-20 rounded-full object-cover" 
              />
            ) : (
              <span className="text-inkwell font-bold text-xl">
                {data.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            )}
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {data.score}%
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-inkwell">{data.name}</h3>
        {data.headline && (
          <p className="text-lunar text-sm">{data.headline}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-inkwell text-center bg-gray-50 p-3 rounded-lg">
          {data.rationale}
        </p>
        
        {(data.shared?.interests?.length || data.shared?.skills?.length) && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-lunar">Shared interests & skills:</h4>
            <div className="flex flex-wrap gap-1">
              {data.shared.interests?.map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  {interest}
                </Badge>
              ))}
              {data.shared.skills?.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onSkip(data.user_id)}
            className="flex-1"
          >
            Skip
          </Button>
          <PrimaryButton
            onClick={() => onShare(data.user_id)}
            className="flex-1"
          >
            Connect
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  )
}
