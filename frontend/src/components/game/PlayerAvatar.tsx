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
          'rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-4',
          className
        )}
      >
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
          {seatLabel}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Avatar className="border-dashed bg-transparent text-slate-500">?</Avatar>
          <div>
            <p className="font-semibold text-slate-400">Kursi kosong</p>
            <p className="text-sm text-slate-500">Menunggu pemain join</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-3xl border bg-white/[0.04] p-4 transition',
        isCurrentTurn
          ? 'border-mint/70 shadow-[0_0_28px_rgba(61,245,191,0.2)] animate-pulseGlow'
          : 'border-white/10',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar>{getInitials(player.nickname)}</Avatar>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              {seatLabel}
            </p>
            <p className="font-semibold text-white">
              {player.nickname} {isSelf ? '(Kamu)' : ''}
            </p>
          </div>
        </div>
        <Badge className="border-white/15 bg-white/8">{player.cardCount} kartu</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {isCurrentTurn && (
          <Badge className="border-mint/30 bg-mint/10 text-mint">Giliran</Badge>
        )}
        {player.hasPassed && (
          <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-200">
            Pass
          </Badge>
        )}
        {!player.isConnected && (
          <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-100">
            Offline
          </Badge>
        )}
      </div>
    </div>
  );
}

