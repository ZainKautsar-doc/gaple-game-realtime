import type { PublicPlayer } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerAvatar } from '@/components/game/PlayerAvatar';

const seatLabels = ['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4'];

interface PlayerListProps {
  players: PublicPlayer[];
  currentTurnId?: string;
  selfId?: string | null;
}

export function PlayerList({
  players,
  currentTurnId,
  selfId,
}: PlayerListProps) {
  return (
    <Card className="section-shell">
      <CardHeader className="pb-4">
        <CardTitle>Lobby Seats</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {seatLabels.map((seatLabel, index) => (
          <PlayerAvatar
            key={seatLabel}
            seatLabel={seatLabel}
            player={players[index]}
            isCurrentTurn={players[index]?.id === currentTurnId}
            isSelf={players[index]?.id === selfId}
          />
        ))}
      </CardContent>
    </Card>
  );
}

