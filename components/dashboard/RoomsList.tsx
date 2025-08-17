import { Badge } from '@/components/ui/badge';

interface Room {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  topic?: string;
  member_count: number;
  is_public: boolean;
}

interface RoomsListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => Promise<void>;
}

export function RoomsList({ rooms, onJoinRoom }: RoomsListProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h3 className="font-semibold text-inkwell mb-4">Active Rooms</h3>
      
      {!rooms.length ? (
        <p className="text-lunar text-sm">No active rooms available.</p>
      ) : (
        <div className="space-y-3">
          {rooms.slice(0, 3).map((room) => (
            <div key={room.id} className="flex items-center justify-between p-3 rounded-xl bg-aulait/20 hover:bg-aulait/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-inkwell truncate">{room.name}</h4>
                  {room.topic && (
                    <Badge variant="secondary" className="text-xs">
                      {room.topic}
                    </Badge>
                  )}
                </div>
                {room.tagline && (
                  <p className="text-sm text-lunar truncate">{room.tagline}</p>
                )}
                <p className="text-xs text-lunar/70 mt-1">
                  {room.member_count} members
                </p>
              </div>
              
              <button
                onClick={() => onJoinRoom(room.id)}
                className="bg-creme hover:bg-creme/90 text-inkwell px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
