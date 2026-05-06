'use client';

import { useEffect, useState } from 'react';
import { Clock3, SignalHigh } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCountdown } from '@/lib/game';
import type { RoomState } from '@/types/game';

interface RoomInfoProps {
  roomState: RoomState | null;
  isConnected: boolean;
}

export function RoomInfo({ roomState, isConnected }: RoomInfoProps) {
  const [countdown, setCountdown] = useState<string | null>(
    formatCountdown(roomState?.countdownEndsAt ?? null)
  );

  useEffect(() => {
    if (!roomState?.countdownEndsAt) {
      setCountdown(null);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(formatCountdown(roomState.countdownEndsAt));
    }, 100);

    return () => clearInterval(interval);
  }, [roomState?.countdownEndsAt]);

  return (
    <Card className="section-shell">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Main Room</CardTitle>
            <p className="mt-2 text-sm text-slate-300">
              Satu meja realtime, auto-start saat 4 pemain sudah penuh.
            </p>
          </div>
          <Badge
            className={
              isConnected
                ? 'border-mint/30 bg-mint/10 text-mint'
                : 'border-rose-400/30 bg-rose-400/10 text-rose-100'
            }
          >
            <SignalHigh className="mr-2 h-3.5 w-3.5" />
            {isConnected ? 'Connected' : 'Connecting'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-slate-400">Status room</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {roomState?.message ?? 'Menghubungkan ke server...'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="border-white/10 bg-white/10 text-slate-100">
            {roomState?.players.length ?? 0}/{roomState?.maxPlayers ?? 4} pemain
          </Badge>
          <Badge className="border-aqua/30 bg-aqua/10 text-aqua">
            Status {roomState?.status ?? 'waiting'}
          </Badge>
          {countdown && (
            <Badge className="border-gold/30 bg-gold/10 text-gold">
              <Clock3 className="mr-2 h-3.5 w-3.5" />
              Start dalam {countdown}s
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

