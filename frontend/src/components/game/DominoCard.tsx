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
  xs: {
    vertical: 'h-16 w-8',
    horizontal: 'w-16 h-8',
  },
  sm: {
    vertical: 'h-24 w-12',
    horizontal: 'w-24 h-12',
  },
  md: {
    vertical: 'h-32 w-16',
    horizontal: 'w-32 h-16',
  },
  lg: {
    vertical: 'h-40 w-20',
    horizontal: 'w-40 h-20',
  },
};

interface DominoCardProps {
  card: DominoCardType;
  onClick?: () => void;
  canPlay?: boolean;
  selected?: boolean;
  disabled?: boolean;
  faceDown?: boolean;
  size?: keyof typeof sizeClasses;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

function CardHalf({
  value,
  orientation,
  size = 'md',
}: {
  value: number;
  orientation: 'vertical' | 'horizontal';
  size?: keyof typeof sizeClasses;
}) {
  const isVertical = orientation === 'vertical';
  
  // Adjust pip size based on card size
  const pipSize = size === 'xs' ? 'h-1.5 w-1.5' : (size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5');

  return (
    <div
      className={cn(
        'relative flex-1 border-nb-outline',
        isVertical 
          ? (size === 'xs' ? 'border-b-[2px]' : 'border-b-[3px]') 
          : (size === 'xs' ? 'border-r-[2px]' : 'border-r-[3px]'),
        'last:border-none'
      )}
    >
      {pipPositions[value].map((position, index) => (
        <span
          key={`${value}-${index}`}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-nb-outline",
            pipSize
          )}
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
  orientation = 'vertical',
  className,
}: DominoCardProps) {
  const interactive = Boolean(onClick) && !disabled;
  const isVertical = orientation === 'vertical';

  return (
    <motion.button
      type="button"
      whileHover={interactive ? { x: 0, y: -2 } : undefined}
      whileTap={interactive ? { x: 2, y: 2 } : undefined}
      transition={{ duration: 0 }}
      onClick={interactive ? onClick : undefined}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-none border-nb-outline',
        size === 'xs' ? 'border-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-[3px] shadow-nb-sm',
        sizeClasses[size][orientation],
        interactive ? 'cursor-pointer hover:border-nb-primary' : 'cursor-default',
        !disabled && !faceDown && 'bg-nb-white',
        !disabled && faceDown && 'bg-nb-primary',
        disabled && 'cursor-not-allowed bg-[#dcd8e8] border-nb-placeholder',
        canPlay && !selected && !disabled
          ? 'border-l-[6px] border-l-nb-secondary border-r-[6px] border-r-nb-secondary border-t-nb-outline border-b-nb-outline'
          : '',
        selected &&
          !disabled &&
          'border-nb-primary z-20 outline outline-[4px] outline-nb-outline outline-offset-[-6px]',
        className
      )}
      aria-label={`Domino ${card.left}-${card.right}`}
    >
      {faceDown ? (
        <div className="absolute inset-[10%] border-[3px] border-nb-white bg-nb-secondary" />
      ) : (
        <div className={cn('flex h-full', isVertical ? 'flex-col' : 'flex-row')}>
          <CardHalf value={card.left} orientation={orientation} size={size} />
          <CardHalf value={card.right} orientation={orientation} size={size} />
        </div>
      )}

      {canPlay && !selected && !faceDown && (
        <div className="pointer-events-none absolute bottom-1 left-0 right-0 top-auto h-2 bg-nb-secondary border-t-[2px] border-nb-outline" />
      )}
    </motion.button>
  );
}
