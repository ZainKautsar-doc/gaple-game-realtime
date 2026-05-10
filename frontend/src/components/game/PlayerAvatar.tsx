import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { PublicPlayer } from '@/types/game';
import { getInitials } from '@/lib/game';

interface PlayerAvatarProps {
  player?: PublicPlayer;
  seatLabel: string;
  isCurrentTurn?: boolean;
  isSelf?: boolean;
  className?: string;
}

export function PlayerAvatar({
  player,
  seatLabel,
  isCurrentTurn = false,
  isSelf = false,
  className,
}: PlayerAvatarProps) {
  if (!player) {
    return (
      <div
        className={cn(
          'relative overflow-hidden border-[3px] border-dashed border-nb-outline bg-nb-white p-4',
          className
        )}
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-nb-placeholder">
          {seatLabel}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-dashed border-nb-outline bg-nb-surface">
            <span className="font-mono font-bold text-nb-placeholder">?</span>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 border-[2px] border-nb-outline bg-nb-surface-low" />
            <div className="h-3 w-32 border-[2px] border-nb-outline bg-nb-surface" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-none border-[3px] border-nb-outline bg-nb-white p-4 shadow-nb-sm',
        isCurrentTurn ? 'outline outline-[3px] outline-nb-secondary outline-offset-2 bg-nb-secondary' : '',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar>{getInitials(player.nickname)}</Avatar>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-nb-placeholder">
              {seatLabel}
            </p>
            <p className="font-display text-lg uppercase leading-tight text-nb-primary">
              {player.nickname}{' '}
              {isSelf ? (
                <span className="font-mono text-[10px] font-bold uppercase text-nb-on-surface">(LU)</span>
              ) : (
                ''
              )}
            </p>
          </div>
        </div>
        <Badge className="border-nb-outline bg-nb-primary text-nb-white font-black">{player.cardCount} KARTU</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {isCurrentTurn && (
          <Badge className="border-nb-outline bg-nb-primary text-nb-white font-black animate-nb-pulse">
            LAGI JALAN
          </Badge>
        )}
        {player.hasPassed && (
          <Badge className="border-nb-outline bg-nb-tertiary text-nb-white font-bold uppercase">
            PASS
          </Badge>
        )}
        {!player.isConnected && (
          <Badge className="border-nb-outline bg-[#dcd8e8] text-nb-on-surface font-bold uppercase">
            DC
          </Badge>
        )}
      </div>
    </div>
  );
}
