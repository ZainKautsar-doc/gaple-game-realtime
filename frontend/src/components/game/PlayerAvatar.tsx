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
          'relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-4',
          className
        )}
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-brand/10 to-transparent" />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
          {seatLabel}
        </p>
        <div className="mt-3 flex items-center gap-3 opacity-50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-slate-700 bg-slate-900/50">
            <span className="text-slate-600">?</span>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-800/50" />
            <div className="h-3 w-32 rounded bg-slate-900/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-3xl border bg-white/[0.04] p-4 transition-all duration-300',
        isCurrentTurn
          ? 'border-brand-light shadow-[0_0_28px_rgba(74,144,226,0.3)]'
          : 'border-white/10',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-white/10">{getInitials(player.nickname)}</Avatar>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              {seatLabel}
            </p>
            <p className="font-bold text-white leading-tight">
              {player.nickname} {isSelf ? <span className="text-brand-light ml-1 text-[10px] underline underline-offset-4">LU CUY</span> : ''}
            </p>
          </div>
        </div>
        <Badge className="border-white/10 bg-white/5 text-[10px] font-black">{player.cardCount} KARTU</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {isCurrentTurn && (
          <Badge className="border-brand-light/30 bg-brand-light/10 text-brand-light font-black animate-pulse">LAGI JALAN</Badge>
        )}
        {player.hasPassed && (
          <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-200 font-bold italic">
            PASS
          </Badge>
        )}
        {!player.isConnected && (
          <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-100 font-bold">
            DC
          </Badge>
        )}
      </div>
    </div>
  );
}
