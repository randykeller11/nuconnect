import { Badge } from '@/components/ui/badge';

interface MatchPreview {
  user_id: string;
  name: string;
  headline?: string;
  avatar?: string;
  score: number;
  shared: {
    interests?: string[];
    skills?: string[];
  };
}

interface MatchPreviewProps {
  items: MatchPreview[];
  onOpenDeck: () => void;
}

export function MatchPreview({ items, onOpenDeck }: MatchPreviewProps) {
  if (!items.length) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold text-inkwell mb-4">Recommended Matches</h3>
        <p className="text-lunar text-sm">Join a room to see potential matches!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-inkwell">Recommended Matches</h3>
        <button
          onClick={onOpenDeck}
          className="text-creme hover:text-creme/80 text-sm font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {items.slice(0, 3).map((match) => (
          <div key={match.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-aulait/20 hover:bg-aulait/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-lunar/20 flex items-center justify-center overflow-hidden">
              {match.avatar ? (
                <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-lunar">
                  {match.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-inkwell truncate">{match.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {match.score}% match
                </Badge>
              </div>
              {match.headline && (
                <p className="text-sm text-lunar truncate">{match.headline}</p>
              )}
              {(match.shared.interests?.length || match.shared.skills?.length) && (
                <div className="flex gap-1 mt-1">
                  {match.shared.interests?.slice(0, 2).map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {match.shared.skills?.slice(0, 1).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
