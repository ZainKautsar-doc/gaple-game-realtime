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
        <div className="flex flex-row flex-nowrap items-center justify-center gap-px max-w-full overflow-x-auto overflow-y-hidden p-8 min-h-[180px] scrollbar-hide">
          {board.map((card, index) => {
            const isBalak = card.left === card.right;
            return (
              <motion.div
                key={`${card.id}-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex-shrink-0"
              >
                <DominoCard
                  card={card}
                  size="sm"
                  orientation={isBalak ? 'vertical' : 'horizontal'}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
