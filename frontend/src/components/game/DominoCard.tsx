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
    <div className="relative flex-1 border-b border-slate-300/70 last:border-b-0">
      {pipPositions[value].map((position, index) => (
        <span
          key={`${value}-${index}`}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900"
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
      whileHover={interactive ? { y: -8, scale: 1.03 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      onClick={interactive ? onClick : undefined}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-900 transition',
        sizeClasses[size],
        interactive ? 'cursor-pointer' : 'cursor-default',
        canPlay
          ? 'border-mint shadow-[0_0_24px_rgba(61,245,191,0.35)]'
          : 'border-slate-300/90',
        selected && 'border-gold shadow-[0_0_24px_rgba(255,214,107,0.35)]',
        disabled && 'opacity-60',
        className
      )}
      aria-label={`Domino ${card.left}-${card.right}`}
    >
      {faceDown ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(61,245,191,0.45),_transparent_35%),linear-gradient(135deg,_#0d1a22,_#14303d)]">
          <div className="h-full w-full bg-grid bg-[length:16px_16px] opacity-25" />
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <CardHalf value={card.left} />
          <CardHalf value={card.right} />
        </div>
      )}

      {canPlay && (
        <div className="pointer-events-none absolute inset-0 bg-mint/10 animate-pulse" />
      )}
    </motion.button>
  );
}

