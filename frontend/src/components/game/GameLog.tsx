'use client';

import { formatTime } from '@/lib/game';
import type { GameMove } from '@/types/game';

interface GameLogProps {
  moves: GameMove[];
}

export function GameLog({ moves }: GameLogProps) {
  const recentMoves = moves.slice(-20).reverse();

  return (
    <div className="log-entries">
      {recentMoves.length === 0 ? (
        <p className="text-xs font-mono font-bold text-nb-placeholder py-2 text-center uppercase">
          No moves yet. Waiting for the first player.
        </p>
      ) : (
        recentMoves.map((move) => (
          <div key={move.id} className="log-entry">
            <span>{move.text}</span>
            <span className="log-time">{formatTime(move.timestamp)}</span>
          </div>
        ))
      )}
    </div>
  );
}
