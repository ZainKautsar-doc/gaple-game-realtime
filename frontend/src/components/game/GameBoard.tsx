'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DominoCard as DominoCardType } from '@/types/game';
import { DominoCard } from './DominoCard';

interface GameBoardProps {
  board: DominoCardType[];
  leftEnd: number | null;
  rightEnd: number | null;
}

export function GameBoard({ board, leftEnd, rightEnd }: GameBoardProps) {
  return (
    <div className="w-full">
      <div className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-casino-text-primary">Table Center</h3>
          <div className="flex items-center gap-2">
            {leftEnd !== null && rightEnd !== null && (
              <Badge className="border-casino-gold/30 bg-casino-gold/10 text-casino-gold px-3 py-1 font-bold text-sm">
                {leftEnd} <ArrowLeftRight className="mx-2 h-4 w-4" /> {rightEnd}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="casino-table relative flex min-h-[300px] flex-wrap items-center justify-center gap-3 p-8 border border-casino-gold/30 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]">
        {board.length === 0 ? (
          <div className="text-center z-10">
            <p className="font-bold text-casino-text-primary text-xl">The table is open</p>
            <p className="mt-2 text-sm text-casino-text-secondary font-medium">Place the first tile to begin the round.</p>
          </div>
        ) : (
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            {board.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
              >
                <DominoCard card={card} size="sm" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

