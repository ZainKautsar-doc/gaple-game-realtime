'use client';

import { formatTime } from '@/lib/game';
import type { GameMove } from '@/types/game';

interface GameLogProps {
  moves: GameMove[];
}

export function GameLog({ moves }: GameLogProps) {
  const recentMoves = moves.slice(-5).reverse();

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white">Game Log</h3>
      <div className="mt-4 space-y-3">
        {recentMoves.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada move. Tunggu pemain pertama jalan.</p>
        ) : (
          recentMoves.map((move) => (
            <div key={move.id} className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-100">{move.text}</p>
                <span className="text-xs text-slate-500">{formatTime(move.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
