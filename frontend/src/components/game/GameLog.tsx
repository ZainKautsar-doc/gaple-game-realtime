'use client';

import { formatTime } from '@/lib/game';
import type { GameMove } from '@/types/game';

interface GameLogProps {
  moves: GameMove[];
}

export function GameLog({ moves }: GameLogProps) {
  const recentMoves = moves.slice(-5).reverse();

  return (
    <div className="casino-card border-casino-gold/15 p-5">
      <h3 className="text-lg font-bold text-casino-text-primary">Game Log</h3>
      <div className="mt-4 space-y-3">
        {recentMoves.length === 0 ? (
          <p className="text-sm text-casino-text-secondary">No moves yet. Waiting for the first player.</p>
        ) : (
          recentMoves.map((move) => (
            <div key={move.id} className="rounded-xl border border-casino-gold/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-casino-text-primary">{move.text}</p>
                <span className="text-xs text-casino-text-muted">{formatTime(move.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
