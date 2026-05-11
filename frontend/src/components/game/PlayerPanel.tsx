'use client';

import { Crown, Hand, SkipForward } from 'lucide-react';
import { formatPosition } from '@/lib/game';
import type { PublicPlayer } from '@/types/game';
import { getInitials } from '@/lib/game';

interface PlayerPanelProps {
  player: PublicPlayer;
  isCurrentTurn?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export function PlayerPanel({
  player,
  isCurrentTurn = false,
  orientation = 'vertical',
}: PlayerPanelProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`flex ${isHorizontal ? 'flex-col gap-2' : 'flex-col gap-2'} w-full items-center`}>
      {/* Player Badge */}
      <div className={`
        flex items-center gap-2
        ${isCurrentTurn ? 'bg-nb-secondary text-nb-on-surface' : 'bg-nb-primary text-nb-white'}
        border-[3px] border-nb-outline
        px-3 py-2
        rounded-none
        w-full
        ${isHorizontal ? 'justify-center max-w-[200px]' : 'flex-col text-center'}
      `}>
        <div className="font-display text-sm font-bold uppercase truncate">
          {getInitials(player.nickname)} {player.nickname}
        </div>
        {player.isHost && <Crown className="h-4 w-4" />}
        {player.hasPassed && <span className="text-[10px] bg-nb-tertiary px-1">PASSED</span>}
      </div>

      {/* Mobile: show card count only */}
      <div className={`lg:hidden flex items-center gap-1.5 border-[3px] border-nb-outline px-3 py-1.5 ${isCurrentTurn ? 'bg-nb-secondary' : 'bg-nb-white'}`}>
        <Hand className="h-3.5 w-3.5 text-nb-primary shrink-0" />
        <span className="font-mono text-xs font-bold text-nb-on-surface">
          {player.cardCount} {player.cardCount === 1 ? 'card' : 'cards'}
        </span>
        {player.hasPassed && (
          <span className="font-mono text-[9px] font-bold uppercase bg-nb-tertiary text-nb-white px-1">PASS</span>
        )}
      </div>

      {/* Desktop: show card stack */}
      <div className={`hidden lg:flex ${isHorizontal ? 'flex-row gap-1 justify-center flex-wrap' : 'flex-col gap-1 items-center'}`}>
        {Array.from({ length: player.cardCount }).map((_, idx) => (
          <div
            key={idx}
            className={`
              ${isHorizontal ? 'w-10 h-16' : 'w-16 h-10'}
              bg-nb-white border-[3px] border-nb-outline
              rounded-none
              flex items-center justify-center
              hover:shadow-nb-sm
              transition-shadow
            `}
          >
            <div className={`bg-nb-outline rounded-full ${isHorizontal ? 'w-1 h-1' : 'w-1.5 h-1.5'}`} />
          </div>
        ))}
        {player.cardCount === 0 && (
          <div className="text-xs font-mono py-2">No cards</div>
        )}
      </div>
    </div>
  );
}
