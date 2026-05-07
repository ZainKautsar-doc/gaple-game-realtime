'use client';

import { motion } from 'framer-motion';
import { Crown, LogOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { msToSecondsLabel } from '@/lib/game';
import type { GameResult } from '@/types/game';

interface EndGameScreenProps {
  result: GameResult;
  myPlayerId: string | null;
  onReturnToLobby: () => void;
  onLeave: () => void;
}

export function EndGameScreen({
  result,
  myPlayerId,
  onReturnToLobby,
  onLeave,
}: EndGameScreenProps) {
  const isWinner = result.winnerId === myPlayerId;
  const countdownLabel = msToSecondsLabel(result.autoReturnAt);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#072820]/80 p-4 backdrop-blur-md">
      {isWinner && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={`win-confetti-${index}`}
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: [0, 1, 1, 0], y: '110vh', x: (index % 2 === 0 ? 1 : -1) * (index * 12) }}
              transition={{
                duration: 3.5 + (index % 5) * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.12,
              }}
              className="absolute top-0 h-3 w-3 rounded-sm shadow-[0_0_8px_rgba(255,214,107,0.8)]"
              style={{
                left: `${5 + index * 4}%`,
                backgroundColor: ['#D4AF37', '#F0D58C', '#B8941F', '#F5F0E8'][index % 4],
              }}
            />
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-3xl overflow-hidden rounded-[16px] border border-casino-gold/40 bg-[linear-gradient(135deg,rgba(13,59,47,1),rgba(17,71,58,1))] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="border-b border-casino-gold/15 bg-casino-bg-surface px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">
            Match Result
          </p>
          <h2 className="mt-2 text-3xl font-bold text-casino-text-primary">
            Round Complete!
          </h2>
          <p className="mt-2 text-sm text-casino-text-secondary">
            {isWinner ? 'You won the round!' : 'Round over. Check the final scores.'}
          </p>
        </div>

        <div className="px-6 py-6 bg-casino-bg-primary/50">
          <div className="space-y-3">
            {result.scores.map((entry) => (
              <div
                key={entry.playerId}
                className={`rounded-xl border px-5 py-4 ${
                  entry.rank === 1
                    ? 'border-casino-gold bg-casino-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'border-casino-gold/15 bg-black/20'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-casino-gold/20 bg-casino-gold/5 text-lg font-bold text-casino-gold">
                      #{entry.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-casino-text-primary">{entry.nickname}</p>
                        {entry.rank === 1 ? <Crown className="h-4 w-4 text-casino-gold" /> : null}
                      </div>
                      <p className="text-sm text-casino-text-secondary">
                        Remaining Tiles: {entry.remainingCards.map((card) => `${card.left}/${card.right}`).join(', ') || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-casino-text-muted">Score</p>
                    <p className="font-mono text-2xl font-bold text-casino-text-primary">{entry.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-casino-text-secondary">
              {countdownLabel
                ? `Returning to table in ${countdownLabel}...`
                : 'Ready for the next round.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={onReturnToLobby}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Return to Table
              </Button>
              <Button variant="outline" onClick={onLeave}>
                <LogOut className="mr-2 h-4 w-4" />
                Leave Table
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
