'use client';

import { SignalHigh } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRoomType } from '@/lib/game';
import type { RoomState } from '@/types/game';

interface RoomInfoProps {
  roomState: RoomState | null;
  isConnected: boolean;
}

export function RoomInfo({ roomState, isConnected }: RoomInfoProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{roomState?.name ?? 'Room Lobby'}</CardTitle>
              <Badge className="border-nb-outline bg-nb-secondary text-nb-on-surface font-bold">
                {formatRoomType(roomState?.type ?? 'public')}
              </Badge>
            </div>
            <p className="font-mono text-sm font-bold text-nb-primary">
              Code:{' '}
              <span className="font-mono uppercase tracking-[0.12em]">{roomState?.code ?? '------'}</span>
            </p>
          </div>
          <Badge
            className={
              isConnected
                ? 'border-nb-outline bg-nb-secondary px-3 py-1 font-bold text-nb-on-surface'
                : 'border-nb-outline bg-nb-tertiary px-3 py-1 animate-nb-pulse font-bold text-nb-white'
            }
          >
            <SignalHigh className="mr-2 h-4 w-4" />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="overflow-hidden border-[3px] border-nb-outline bg-nb-surface-low p-5 shadow-nb-sm">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-nb-placeholder">
            Kabar Meja
          </p>
          <p className="mt-3 font-display text-xl uppercase text-nb-primary">
            {roomState?.message ?? 'Otw nyambungin...'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="border-nb-outline bg-nb-white px-4 py-1.5 text-sm font-bold text-nb-on-surface">
            <span className="font-mono mr-2 text-lg font-black text-nb-primary">
              {roomState?.currentPlayers ?? 0}
            </span>{' '}
            / {roomState?.maxPlayers ?? 4} Orang
          </Badge>
          <Badge className="border-nb-outline bg-nb-primary px-4 py-1.5 text-sm font-bold capitalize text-nb-white">
            {roomState?.status === 'waiting' ? 'Waiting' : roomState?.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
