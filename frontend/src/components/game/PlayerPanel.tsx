'use client';

import { Crown, Hand, SkipForward } from 'lucide-react';
import { formatPosition, getInitials } from '@/lib/game';
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
      className={`rounded-xl border p-4 transition-all duration-300 ${
        isCurrentTurn
          ? 'border-casino-gold bg-casino-gold/10 shadow-casino-glow ring-1 ring-casino-gold/30'
          : 'border-casino-gold/15 bg-casino-bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-casino-text-secondary">
            {formatPosition(player.position)}
          </p>
          <p className="mt-1 text-base font-bold text-casino-text-primary">
            {player.nickname} {isSelf ? <span className="text-xs font-medium text-casino-gold ml-1">You</span> : null}
          </p>
        </div>
        {player.isHost ? (
          <span className="rounded-full border border-casino-gold/30 bg-casino-gold/10 p-2 text-casino-gold">
            <Crown className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-casino-gold/10 bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-casino-text-secondary">
          <Hand className="h-3.5 w-3.5" />
          {player.cardCount} tiles
        </span>
        {player.hasPassed ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-casino-gold/30 bg-casino-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-casino-gold">
            <SkipForward className="h-3.5 w-3.5" />
            Passed
          </span>
        ) : null}
        {isCurrentTurn ? (
          <span className="inline-flex animate-glow items-center rounded-full border border-casino-gold/40 bg-casino-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-casino-gold">
            Thinking
          </span>
        ) : null}
      </div>
    </div>
  );
}
