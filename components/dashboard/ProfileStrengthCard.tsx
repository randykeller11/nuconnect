import { Badge } from '@/components/ui/badge';
import { ProfileStrengthResult } from '@/lib/profile/strength';

interface ProfileStrengthCardProps {
  strength: ProfileStrengthResult;
  onImprove: () => void;
}

export function ProfileStrengthCard({ strength, onImprove }: ProfileStrengthCardProps) {
  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthTextColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    if (score >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-inkwell">Profile Strength</h3>
        <Badge variant="secondary" className={getStrengthTextColor(strength.score)}>
          {strength.level}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-lunar">Completion</span>
          <span className="text-sm font-medium text-inkwell">{strength.score}%</span>
        </div>
        <div className="w-full bg-aulait/30 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {strength.suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-lunar mb-2">Next step:</p>
          <p className="text-sm text-inkwell">{strength.suggestions[0]}</p>
        </div>
      )}

      <button
        onClick={onImprove}
        className="w-full bg-creme/10 hover:bg-creme/20 text-creme border border-creme/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Improve Profile
      </button>
    </div>
  );
}
