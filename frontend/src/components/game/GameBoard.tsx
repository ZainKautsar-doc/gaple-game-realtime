'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DominoCard as DominoCardType } from '@/types/game';
import { DominoCard } from './DominoCard';

interface GameBoardProps {
  board: DominoCardType[];
  leftEnd: number | null;
  rightEnd: number | null;
}

export function GameBoard({ board, leftEnd, rightEnd }: GameBoardProps) {
  return (
    <Card className="section-shell">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Board</CardTitle>
          <div className="flex items-center gap-2">
            {leftEnd !== null && rightEnd !== null && (
              <Badge className="border-mint/30 bg-mint/10 text-mint">
                {leftEnd} <ArrowLeftRight className="mx-1 h-3.5 w-3.5" /> {rightEnd}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[250px] flex-wrap items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-black/20 p-5">
          {board.length === 0 ? (
            <div className="text-center text-slate-400">
              <p className="font-medium text-slate-200">Meja masih kosong</p>
              <p className="mt-2 text-sm">Pemain pertama bisa meletakkan kartu apa pun.</p>
            </div>
          ) : (
            board.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                initial={{ opacity: 0, y: 18, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <DominoCard card={card} size="sm" />
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

