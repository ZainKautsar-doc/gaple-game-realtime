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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const contentWidth = contentRef.current.scrollWidth;
      const contentHeight = contentRef.current.scrollHeight;
      const padding = mobile ? 16 : 40;

      // On mobile: scale based on both width AND card count (more aggressive zoom-out)
      if (mobile) {
        const tileCount = board.length;
        // Each tile is ~56px wide; estimate needed width
        const estimatedWidth = tileCount * 58;
        const scaleByWidth = estimatedWidth > containerWidth - padding
          ? (containerWidth - padding) / estimatedWidth
          : 1;

        // Also scale based on actual rendered content
        const scaleByContent = contentWidth > containerWidth - padding
          ? (containerWidth - padding) / contentWidth
          : 1;

        // Use the more aggressive (smaller) scale, min 0.2 on mobile
        const finalScale = Math.min(scaleByWidth, scaleByContent);
        setBoardScale(Math.max(finalScale, 0.2));
      } else {
        // Desktop: original behavior
        if (contentWidth > containerWidth - 40) {
          setBoardScale(Math.max((containerWidth - 40) / contentWidth, 0.4));
        } else {
          setBoardScale(1);
        }
      }
    };

    calculateScale();
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

      {/* Scale indicator — mobile only when zoomed out */}
      {isMobile && boardScale < 0.95 && (
        <div className="absolute bottom-2 left-2 bg-nb-white/80 border-[2px] border-nb-outline px-2 py-0.5 font-mono text-[10px] font-bold uppercase pointer-events-none">
          {(boardScale * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
