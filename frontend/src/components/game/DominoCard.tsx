'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DominoCard as DominoCardType } from '@/types/game';

const pipPositions: Record<
  number,
  Array<{ left: string; top: string }>
> = {
  0: [],
  1: [{ left: '50%', top: '50%' }],
  2: [
    { left: '32%', top: '32%' },
    { left: '68%', top: '68%' },
  ],
  3: [
    { left: '32%', top: '32%' },
    { left: '50%', top: '50%' },
    { left: '68%', top: '68%' },
  ],
  4: [
    { left: '32%', top: '28%' },
    { left: '68%', top: '28%' },
    { left: '32%', top: '72%' },
    { left: '68%', top: '72%' },
  ],
  5: [
    { left: '32%', top: '28%' },
    { left: '68%', top: '28%' },
    { left: '50%', top: '50%' },
    { left: '32%', top: '72%' },
    { left: '68%', top: '72%' },
  ],
  6: [
    { left: '32%', top: '24%' },
    { left: '68%', top: '24%' },
    { left: '32%', top: '50%' },
    { left: '68%', top: '50%' },
    { left: '32%', top: '76%' },
    { left: '68%', top: '76%' },
  ],
};

const sizeClasses = {
  sm: 'h-24 w-12',
  md: 'h-32 w-16',
  lg: 'h-40 w-20',
};

interface DominoCardProps {
  card: DominoCardType;
  onClick?: () => void;
  canPlay?: boolean;
  selected?: boolean;
  disabled?: boolean;
  faceDown?: boolean;
  size?: keyof typeof sizeClasses;
  className?: string;
}

function CardHalf({ value }: { value: number }) {
  return (
    <div className="relative flex-1 border-b-[1.5px] border-[#d4af37]/30 last:border-b-0">
      {pipPositions[value].map((position, index) => (
        <span
          key={`${value}-${index}`}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-900 to-black shadow-[inset_0_-1px_1px_rgba(255,255,255,0.3)]"
          style={position}
        />
      ))}
    </div>
  );
}

export function DominoCard({
  card,
  onClick,
  canPlay = false,
  selected = false,
  disabled = false,
  faceDown = false,
  size = 'md',
  className,
}: DominoCardProps) {
  const interactive = Boolean(onClick) && !disabled;

  return (
    <motion.button
      type="button"
      whileHover={interactive ? { y: -8, scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      onClick={interactive ? onClick : undefined}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-[10px] border-2 transition-all duration-300 transform-gpu',
        sizeClasses[size],
        interactive ? 'cursor-pointer' : 'cursor-default',
        faceDown 
          ? 'bg-[linear-gradient(135deg,#0a3d2e,#072820)] border-casino-gold/40' 
          : 'bg-[linear-gradient(135deg,#fdfbf7,#f0e6d2)] border-[#d4af37]/50 shadow-[2px_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.8)]',
        canPlay && !selected
          ? 'border-casino-gold shadow-[0_0_20px_rgba(212,175,55,0.5),2px_4px_8px_rgba(0,0,0,0.4)]'
          : '',
        selected && 'border-casino-gold shadow-[0_0_24px_rgba(212,175,55,0.8),4px_8px_12px_rgba(0,0,0,0.5)] scale-[1.1] z-20',
        disabled && 'opacity-60 grayscale-[0.3]',
        className
      )}
      aria-label={`Domino ${card.left}-${card.right}`}
    >
      {faceDown ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[80%] w-[80%] rounded-[6px] border border-casino-gold/20 bg-casino-gold/5 flex items-center justify-center">
            <div className="h-[50%] w-[50%] bg-casino-gold/20 rounded-full blur-[2px]" />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <CardHalf value={card.left} />
          <CardHalf value={card.right} />
        </div>
      )}

      {canPlay && !selected && (
        <div className="pointer-events-none absolute inset-0 bg-casino-gold/10 animate-pulse" />
      )}
    </motion.button>
  );
}

