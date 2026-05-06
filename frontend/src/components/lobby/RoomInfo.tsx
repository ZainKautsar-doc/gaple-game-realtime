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
    <Card className="section-shell relative overflow-hidden border-white/10 bg-[#0a1219]/80 backdrop-blur-xl shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent pointer-events-none" />
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="font-[var(--font-display)] text-2xl text-white">Meja Utama</CardTitle>
              <Badge className="bg-brand text-white border-none font-bold">
                GG
              </Badge>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              ID: <span className="font-mono text-brand-light">XJ92-K8L</span> • Auto-gas pas udah rame
            </p>
          </div>
          <Badge
            className={
              isConnected
                ? 'border-brand-light/30 bg-brand-light/10 text-brand-light px-3 py-1 font-bold'
                : 'border-rose-400/30 bg-rose-400/10 text-rose-100 px-3 py-1 animate-pulse'
            }
          >
            <SignalHigh className="mr-2 h-4 w-4" />
            {isConnected ? 'Online Cuy' : 'Lagi Nyari Sinyal'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          {countdown && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0" />
          )}
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Kabar Meja</p>
          <p className={`mt-2 text-xl font-bold ${countdown ? 'text-gold' : 'text-white'}`}>
            {roomState?.message?.replace('Menunggu', 'Nungguin').replace('pemain lagi', 'orang lagi') ?? 'Otw nyambungin...'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="border-white/10 bg-white/5 text-slate-200 px-4 py-1.5 text-sm rounded-full font-bold">
            <span className="text-brand-light font-black mr-1">{roomState?.players.length ?? 0}</span>
            / {roomState?.maxPlayers ?? 4} Orang
          </Badge>
          <Badge className="border-brand/30 bg-brand/10 text-brand-light px-4 py-1.5 text-sm rounded-full capitalize font-bold">
            {roomState?.status === 'waiting' ? 'Nongkrong' : roomState?.status}
          </Badge>
          {countdown && (
            <Badge className="border-gold/30 bg-gold/10 text-gold px-4 py-1.5 text-sm rounded-full animate-bounce font-black">
              <Clock3 className="mr-2 h-4 w-4" />
              Gaspol dlm {countdown}s
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
