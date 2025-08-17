import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MatchCardData {
  user_id: string;
  name: string;
  headline?: string;
  avatar?: string;
  score: number;
  shared: {
    interests?: string[];
    skills?: string[];
  };
  rationale: string;
}

interface MatchCardProps {
  data: MatchCardData;
  onShare: (id: string) => Promise<void>;
  onSkip: (id: string) => void;
}

export function MatchCard({ data, onShare, onSkip }: MatchCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-lunar/20 flex items-center justify-center overflow-hidden">
          {data.avatar ? (
            <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-semibold text-lunar">
              {data.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-inkwell text-lg truncate">{data.name}</h3>
          {data.headline && (
            <p className="text-lunar text-sm truncate">{data.headline}</p>
          )}
        </div>
        
        <Badge className={`${getScoreColor(data.score)} border-0 font-semibold`}>
          {data.score}% match
        </Badge>
      </div>

      {/* Rationale */}
      <div className="mb-4">
        <p className="text-inkwell text-sm leading-relaxed">{data.rationale}</p>
      </div>

      {/* Shared Interests/Skills */}
      {(data.shared.interests?.length || data.shared.skills?.length) && (
        <div className="mb-6">
          <p className="text-xs font-medium text-lunar mb-2">You both have:</p>
          <div className="flex flex-wrap gap-1">
            {data.shared.interests?.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {data.shared.skills?.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => onSkip(data.user_id)}
          className="flex-1"
        >
          Skip
        </Button>
        <Button
          onClick={() => onShare(data.user_id)}
          className="flex-1 bg-creme hover:bg-creme/90 text-inkwell"
        >
          Connect
        </Button>
      </div>
    </div>
  );
}
