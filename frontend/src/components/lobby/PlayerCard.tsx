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
  north: 'border-casino-gold/30 bg-black/20',
  south: 'border-casino-gold/30 bg-black/20',
  east: 'border-casino-gold/30 bg-black/20',
  west: 'border-casino-gold/30 bg-black/20',
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
      <div className="rounded-[16px] border border-dashed border-casino-gold/20 bg-black/10 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-text-muted">Empty Seat</p>
        <div className="mt-5 flex items-center gap-4 opacity-40">
          <div className="h-14 w-14 rounded-full border border-dashed border-casino-gold/30 bg-black/20" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-3 w-28 rounded-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[16px] border bg-gradient-to-br p-5 shadow-casino-sm transition ${
        positionStyles[player.position]
      } ${isSelf ? 'border-casino-gold shadow-casino-glow ring-1 ring-casino-gold/30' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-full border border-casino-gold/50 bg-casino-gold/10 text-casino-gold text-base font-bold">
            {getInitials(player.nickname)}
          </Avatar>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-casino-text-secondary">
              {formatPosition(player.position)}
            </p>
            <p className="mt-1 text-lg font-bold text-casino-text-primary">
              {player.nickname}
              {isSelf && <span className="ml-2 text-xs font-medium text-casino-gold">You</span>}
            </p>
          </div>
        </div>
        {player.isHost && (
          <span className="inline-flex items-center gap-1 rounded-full border border-casino-gold/30 bg-casino-gold/10 px-3 py-1 text-xs font-bold text-casino-gold">
            <Crown className="h-3.5 w-3.5" />
            Host
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            player.isReady
              ? 'border-casino-gold/50 bg-casino-gold/20 text-casino-gold'
              : 'border-casino-gold/10 bg-black/20 text-casino-text-muted'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {player.isReady ? 'Ready' : 'Not Ready'}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-casino-gold/10 bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-casino-text-secondary">
          <Sparkles className="h-3.5 w-3.5" />
          {player.cardCount} Tiles
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {isSelf && onToggleReady && (
          <Button variant={player.isReady ? 'outline' : 'primary'} onClick={onToggleReady} size="sm" className="rounded-full">
            {player.isReady ? 'Cancel Ready' : 'I am Ready'}
          </Button>
        )}
        {showKick && onKick && (
          <Button variant="danger" onClick={onKick} size="sm" className="rounded-full">
            <LogOut className="mr-2 h-4 w-4" />
            Kick
          </Button>
        )}
      </div>
    </div>
  );
}
