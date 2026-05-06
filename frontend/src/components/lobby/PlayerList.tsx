import { motion } from 'framer-motion';
import type { PublicPlayer } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerAvatar } from '@/components/game/PlayerAvatar';

const positions = [
  { label: 'North', color: 'from-[#00D9FF] to-blue-500' },
  { label: 'East', color: 'from-[#39FF14] to-green-500' },
  { label: 'South', color: 'from-amber-400 to-orange-500' },
  { label: 'West', color: 'from-purple-400 to-pink-500' },
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
    <Card className="section-shell relative overflow-hidden border-white/10 bg-[#0F172A]/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <CardHeader className="pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-[var(--font-display)] text-white">Lobby Seats</CardTitle>
          <div className="text-sm font-medium text-[#00D9FF]">
            {players.length} / 4 Ready
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 pt-6 relative z-10">
        {positions.map((pos, index) => {
          const player = players[index];
          return (
            <motion.div
              key={pos.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PlayerAvatar
                seatLabel={`${pos.label} Seat`}
                player={player}
                isCurrentTurn={player?.id === currentTurnId}
                isSelf={player?.id === selfId}
                className={player ? `border-l-4 border-l-transparent shadow-lg shadow-black/50 [border-image:linear-gradient(to_bottom,var(--tw-gradient-stops))_1]` : ''}
              />
              {/* Note: In a real implementation we'd pass the color to PlayerAvatar to style the border, 
                  but we'll just let PlayerAvatar handle its own default styling for now to maintain compatibility */}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

