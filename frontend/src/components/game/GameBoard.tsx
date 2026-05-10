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
        <div className="text-center">
          <p className="font-bold text-casino-text-primary/70 text-lg">The table is open</p>
          <p className="mt-1 text-sm text-casino-text-secondary/60 font-medium">
            Place the first tile
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-full overflow-hidden p-2">
          {board.map((card, index) => (
            <motion.div
              key={`${card.id}-${index}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: index * 0.04,
              }}
            >
              <DominoCard card={card} size="sm" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
