'use client';

import { Crown, Hand, SkipForward } from 'lucide-react';
import { formatPosition } from '@/lib/game';
import type { PublicPlayer } from '@/types/game';

interface PlayerPanelProps {
  player: PublicPlayer;
  isCurrentTurn?: boolean;
  isSelf?: boolean;
}

export function PlayerPanel({
  player,
  isCurrentTurn = false,
  isSelf = false,
}: PlayerPanelProps) {
  return (
    <div
      className={`border-[3px] border-nb-outline p-4 shadow-nb-sm ${
        isCurrentTurn
          ? 'bg-nb-secondary outline outline-[3px] outline-offset-0 outline-nb-outline'
          : 'bg-nb-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-nb-on-surface">
            {formatPosition(player.position)}
          </p>
          <p className="mt-2 font-display text-lg uppercase text-nb-primary">
            {player.nickname}{' '}
            {isSelf ? (
              <span className="font-mono text-xs font-bold normal-case text-nb-on-surface">(you)</span>
            ) : null}
          </p>
        </div>
        {player.isHost ? (
          <span className="rounded-none border-[3px] border-nb-outline bg-nb-primary p-2 text-nb-white">
            <Crown className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 border-[3px] border-nb-outline bg-nb-surface px-3 py-1 font-mono text-xs font-bold uppercase text-nb-on-surface">
          <Hand className="h-3.5 w-3.5 text-nb-primary" />
          {player.cardCount} tiles
        </span>
        {player.hasPassed ? (
          <span className="inline-flex items-center gap-1 border-[3px] border-nb-outline bg-nb-tertiary px-3 py-1 font-mono text-xs font-bold uppercase text-nb-white">
            <SkipForward className="h-3.5 w-3.5" />
            Passed
          </span>
        ) : null}
        {isCurrentTurn ? (
          <span className="inline-flex animate-nb-pulse items-center border-[3px] border-nb-outline bg-nb-white px-3 py-1 font-mono text-xs font-bold uppercase text-nb-on-surface">
            Thinking
          </span>
        ) : null}
      </div>
    </div>
  );
}
