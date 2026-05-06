'use client';

import { Crown, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatPosition, getInitials } from '@/lib/game';
import type { PublicPlayer } from '@/types/game';

interface PlayerCardProps {
  player?: PublicPlayer;
  isSelf?: boolean;
  showKick?: boolean;
  onKick?: () => void;
  onToggleReady?: () => void;
}

const positionStyles = {
  north: 'from-cyan-500/20 to-blue-500/5 border-cyan-400/25',
  south: 'from-green-500/20 to-emerald-500/5 border-green-400/25',
  east: 'from-amber-500/20 to-orange-500/5 border-amber-400/25',
  west: 'from-fuchsia-500/20 to-pink-500/5 border-fuchsia-400/25',
};

export function PlayerCard({
  player,
  isSelf = false,
  showKick = false,
  onKick,
  onToggleReady,
}: PlayerCardProps) {
  if (!player) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Empty Seat</p>
        <div className="mt-5 flex items-center gap-4 opacity-60">
          <div className="h-14 w-14 rounded-2xl border border-dashed border-white/10 bg-black/20" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded-full bg-white/5" />
            <div className="h-3 w-28 rounded-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[28px] border bg-gradient-to-br p-5 shadow-lg transition ${
        positionStyles[player.position]
      } ${isSelf ? 'shadow-[0_0_30px_rgba(0,217,255,0.18)] ring-1 ring-brand/30' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl text-base">
            {getInitials(player.nickname)}
          </Avatar>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
              {formatPosition(player.position)}
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {player.nickname}
              {isSelf && <span className="ml-2 text-xs text-brand-light">You</span>}
            </p>
          </div>
        </div>
        {player.isHost && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
            <Crown className="h-3.5 w-3.5" />
            Host
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
            player.isReady
              ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200'
              : 'border-white/10 bg-white/5 text-slate-300'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {player.isReady ? 'Ready' : 'Belum ready'}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          <Sparkles className="h-3.5 w-3.5" />
          {player.cardCount} kartu
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {isSelf && onToggleReady && (
          <Button variant={player.isReady ? 'secondary' : 'primary'} onClick={onToggleReady}>
            {player.isReady ? 'Batalkan Ready' : 'Saya Ready'}
          </Button>
        )}
        {showKick && onKick && (
          <Button variant="danger" onClick={onKick}>
            <LogOut className="mr-2 h-4 w-4" />
            Kick
          </Button>
        )}
      </div>
    </div>
  );
}
