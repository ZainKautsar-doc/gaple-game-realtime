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
  north: 'bg-nb-surface-low',
  south: 'bg-nb-surface-low',
  east: 'bg-nb-surface-low',
  west: 'bg-nb-surface-low',
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
      <div className="border-[3px] border-dashed border-nb-outline bg-nb-white p-5 shadow-nb-sm">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-placeholder">
          Empty Seat
        </p>
        <div className="mt-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-none border-[3px] border-dashed border-nb-outline bg-nb-surface" />
          <div className="space-y-2">
            <div className="h-4 w-24 border-[3px] border-nb-outline bg-nb-surface-low" />
            <div className="h-3 w-28 border-[3px] border-nb-outline bg-nb-surface" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-[3px] border-nb-outline bg-nb-white p-5 shadow-nb-sm ${
        positionStyles[player.position]
      } ${isSelf ? 'outline outline-[3px] outline-nb-secondary outline-offset-2' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 text-lg border-nb-outline bg-nb-secondary text-nb-on-surface shadow-nb-sm">
            {getInitials(player.nickname)}
          </Avatar>
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-nb-placeholder">
              {formatPosition(player.position)}
            </p>
            <p className="mt-1 font-display text-lg uppercase text-nb-primary">
              {player.nickname}
              {isSelf && (
                <span className="ml-2 font-mono text-xs font-bold normal-case text-nb-on-surface">
                  You
                </span>
              )}
            </p>
          </div>
        </div>
        {player.isHost && (
          <span className="inline-flex items-center gap-1 border-[3px] border-nb-outline bg-nb-primary px-3 py-1 font-mono text-xs font-bold uppercase text-nb-white">
            <Crown className="h-3.5 w-3.5 text-nb-secondary" />
            Host
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 border-[3px] border-nb-outline px-3 py-1 font-mono text-xs font-bold uppercase shadow-nb-sm ${
            player.isReady
              ? 'bg-nb-secondary text-nb-on-surface'
              : 'bg-nb-surface text-nb-placeholder'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {player.isReady ? 'Ready' : 'Not Ready'}
        </span>
        <span className="inline-flex items-center gap-1 border-[3px] border-nb-outline bg-nb-white px-3 py-1 font-mono text-xs font-bold uppercase text-nb-on-surface">
          <Sparkles className="h-3.5 w-3.5 text-nb-primary" />
          {player.cardCount} Tiles
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {isSelf && onToggleReady && (
          <Button variant={player.isReady ? 'outline' : 'primary'} onClick={onToggleReady} size="sm">
            {player.isReady ? 'Cancel Ready' : 'I am Ready'}
          </Button>
        )}
        {showKick && onKick && (
          <Button variant="danger" onClick={onKick} size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Kick
          </Button>
        )}
      </div>
    </div>
  );
}
