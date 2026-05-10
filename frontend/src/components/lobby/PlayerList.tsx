import { motion } from 'framer-motion';
import type { PublicPlayer } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerAvatar } from '@/components/game/PlayerAvatar';

const positions = [
  { label: 'North', accent: 'bg-nb-surface-low' },
  { label: 'East', accent: 'bg-nb-secondary' },
  { label: 'South', accent: 'bg-nb-surface-low' },
  { label: 'West', accent: 'bg-nb-secondary' },
];

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
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4 border-b-[3px] border-nb-outline relative z-10 bg-nb-primary">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-nb-white">Lobby Seats</CardTitle>
          <div className="font-mono text-sm font-bold uppercase text-nb-secondary">
            {players.length} / 4 Ready
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 pt-6 relative z-10 bg-nb-white">
        {positions.map((pos, index) => {
          const player = players[index];
          return (
            <motion.div
              key={pos.label}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
              className={pos.accent}
            >
              <PlayerAvatar
                seatLabel={`${pos.label} Seat`}
                player={player}
                isCurrentTurn={player?.id === currentTurnId}
                isSelf={player?.id === selfId}
                className={
                  player
                    ? 'border-[3px] border-nb-outline shadow-nb-sm'
                    : ''
                }
              />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
