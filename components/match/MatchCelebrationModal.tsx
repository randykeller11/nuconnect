import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MatchCelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  me: {
    name: string;
    avatar?: string;
  };
  other: {
    name: string;
    avatar?: string;
    linkedin_url?: string;
    email?: string;
  };
}

export function MatchCelebrationModal({ 
  open, 
  onOpenChange, 
  me, 
  other 
}: MatchCelebrationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-inkwell">
            🎉 It's a Match!
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-center gap-4 my-6">
          {/* Me */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-lunar/20 flex items-center justify-center overflow-hidden mx-auto mb-2">
              {me.avatar ? (
                <img src={me.avatar} alt={me.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-lunar">
                  {me.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-inkwell">{me.name}</p>
          </div>
          
          {/* Connection indicator */}
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-creme"></div>
            <div className="w-3 h-3 bg-creme rounded-full mx-1"></div>
            <div className="w-8 h-0.5 bg-creme"></div>
          </div>
          
          {/* Other person */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-lunar/20 flex items-center justify-center overflow-hidden mx-auto mb-2">
              {other.avatar ? (
                <img src={other.avatar} alt={other.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-lunar">
                  {other.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-inkwell">{other.name}</p>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-lunar text-sm">
            You both shared contact info! Here's how to reach {other.name}:
          </p>
        </div>
        
        {/* Contact info */}
        <div className="space-y-3 mb-6">
          {other.linkedin_url && (
            <div className="flex items-center justify-between p-3 bg-aulait/20 rounded-lg">
              <span className="text-sm text-lunar">LinkedIn</span>
              <a
                href={other.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-creme hover:text-creme/80 font-medium"
              >
                View Profile
              </a>
            </div>
          )}
          {other.email && (
            <div className="flex items-center justify-between p-3 bg-aulait/20 rounded-lg">
              <span className="text-sm text-lunar">Email</span>
              <a
                href={`mailto:${other.email}`}
                className="text-sm text-creme hover:text-creme/80 font-medium"
              >
                {other.email}
              </a>
            </div>
          )}
        </div>
        
        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-creme hover:bg-creme/90 text-inkwell"
        >
          Continue Matching
        </Button>
      </DialogContent>
    </Dialog>
  );
}
