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
      className={`rounded-[28px] border p-4 transition ${
        isCurrentTurn
          ? 'border-brand/40 bg-brand/10 shadow-[0_0_28px_rgba(0,217,255,0.14)]'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
            {formatPosition(player.position)}
          </p>
          <p className="mt-1 text-base font-semibold text-white">
            {player.nickname} {isSelf ? <span className="text-xs text-brand-light">You</span> : null}
          </p>
          <p className="mt-1 text-xs text-slate-400">{getInitials(player.nickname)}</p>
        </div>
        {player.isHost ? (
          <span className="rounded-full border border-amber-300/20 bg-amber-400/10 p-2 text-amber-200">
            <Crown className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs text-slate-300">
          <Hand className="h-3.5 w-3.5" />
          {player.cardCount} kartu
        </span>
        {player.hasPassed ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-100">
            <SkipForward className="h-3.5 w-3.5" />
            Passed
          </span>
        ) : null}
        {isCurrentTurn ? (
          <span className="inline-flex animate-glow items-center rounded-full border border-brand/20 bg-brand/15 px-3 py-1 text-xs text-brand-light">
            Lagi jalan
          </span>
        ) : null}
      </div>
    </div>
  );
}
