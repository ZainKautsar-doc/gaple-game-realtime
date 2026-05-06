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
        'relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-white via-slate-50 to-slate-200 text-slate-900 transition-all duration-300',
        sizeClasses[size],
        interactive ? 'cursor-pointer' : 'cursor-default',
        canPlay
          ? 'border-brand-light shadow-[0_0_24px_rgba(74,144,226,0.4)]'
          : 'border-slate-300/90',
        selected && 'border-gold shadow-[0_0_24px_rgba(255,214,107,0.4)] scale-[1.05] z-10',
        disabled && 'opacity-60 grayscale-[0.5]',
        className
      )}
      aria-label={`Domino ${card.left}-${card.right}`}
    >
      {faceDown ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,83,182,0.4),_transparent_40%),linear-gradient(135deg,_#0a1219,_#152938)]">
          <div className="h-full w-full bg-grid bg-[length:16px_16px] opacity-20" />
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <CardHalf value={card.left} />
          <CardHalf value={card.right} />
        </div>
      )}

      {canPlay && (
        <div className="pointer-events-none absolute inset-0 bg-brand-light/5 animate-pulse" />
      )}
    </motion.button>
  );
}

