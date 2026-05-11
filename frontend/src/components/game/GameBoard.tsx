'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { DominoCard as DominoCardType } from '@/types/game';
import { DominoCard } from './DominoCard';

interface GameBoardProps {
  board: DominoCardType[];
  leftEnd: number | null;
  rightEnd: number | null;
}

export function GameBoard({ board }: GameBoardProps) {
  const [boardScale, setBoardScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const padding = 40; // 20px on each side

      if (contentWidth > containerWidth - padding) {
        const calculatedScale = (containerWidth - padding) / contentWidth;
        // Limit scale to prevent cards from becoming too small
        setBoardScale(Math.max(calculatedScale, 0.4));
      } else {
        setBoardScale(1);
      }
    };

    // Calculate on mount and when board changes
    calculateScale();

    // Recalculate on window resize
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [board.length]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
    >
      {board.length === 0 ? (
        <div className="text-center px-4">
          <p className="font-display text-lg uppercase text-nb-primary">
            The table is open
          </p>
          <p className="mt-2 font-mono text-sm font-bold text-nb-on-surface uppercase">
            Place the first tile
          </p>
        </div>
      ) : (
        <div
          ref={contentRef}
          style={{
            transform: `scale(${boardScale})`,
            transformOrigin: 'center center',
            transition: 'transform 300ms ease-out',
          }}
          className="flex flex-row flex-nowrap items-center justify-center gap-px max-w-none p-8 min-h-[180px] scrollbar-hide"
        >
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

      {/* Scale indicator for debugging/info (optional but good for UX) */}
      {boardScale < 1 && (
        <div className="absolute bottom-2 left-2 bg-nb-white/80 border-[2px] border-nb-outline px-2 py-0.5 font-mono text-[10px] font-bold uppercase pointer-events-none">
          Scale: {(boardScale * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
