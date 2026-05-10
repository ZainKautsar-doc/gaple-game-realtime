'use client';

import { motion } from 'framer-motion';
import type { DominoCard as DominoCardType } from '@/types/game';
import { DominoCard } from './DominoCard';

interface GameBoardProps {
  board: DominoCardType[];
  leftEnd: number | null;
  rightEnd: number | null;
}

export function GameBoard({ board }: GameBoardProps) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {board.length === 0 ? (
        <div className="text-center px-4">
          <p className="font-display text-lg uppercase text-nb-primary">The table is open</p>
          <p className="mt-2 font-mono text-sm font-bold text-nb-on-surface uppercase">
            Place the first tile
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-full overflow-hidden p-2">
          {board.map((card, index) => (
            <motion.div
              key={`${card.id}-${index}`}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <DominoCard card={card} size="sm" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
