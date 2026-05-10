'use client';

import { motion } from 'framer-motion';
import { Crown, LogOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { msToSecondsLabel } from '@/lib/game';
import { getAvatarById } from '@/lib/avatars';
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-nb-outline p-4">
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className="w-full max-w-3xl overflow-hidden border-[3px] border-nb-outline bg-nb-white shadow-nb-md"
      >
        <div className="border-b-[3px] border-nb-outline bg-nb-primary px-6 py-5">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-secondary">
            Match Result
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase text-nb-white">
            Round Complete!
          </h2>
          <p className="mt-2 font-mono text-sm font-bold uppercase text-nb-white">
            {isWinner ? 'You won the round!' : 'Round over. Check the final scores.'}
          </p>
        </div>

        <div className="border-b-[3px] border-nb-outline bg-nb-surface px-6 py-6">
          <div className="space-y-3">
            {result.scores.map((entry) => (
              <div
                key={entry.playerId}
                className={`border-[3px] border-nb-outline px-5 py-4 shadow-nb-sm ${
                  entry.rank === 1 ? 'bg-nb-secondary' : 'bg-nb-white'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-none border-[3px] border-nb-outline bg-nb-white font-mono text-2xl shadow-nb-sm">
                      {getAvatarById(entry.avatarId).emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-lg uppercase text-nb-primary">
                          <span className="font-mono text-sm font-bold text-nb-placeholder mr-1">#{entry.rank}</span>
                          {entry.nickname}
                        </p>
                        {entry.rank === 1 ? <Crown className="h-4 w-4 text-nb-primary" /> : null}
                      </div>
                      <p className="font-mono text-sm font-medium text-nb-on-surface">
                        Remaining Tiles:{' '}
                        {entry.remainingCards.map((card) => `${card.left}/${card.right}`).join(', ') ||
                          '-'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-placeholder">
                      Score
                    </p>
                    <p className="font-mono text-2xl font-bold text-nb-primary">{entry.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-sm font-bold text-nb-on-surface uppercase">
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

        {isWinner && (
          <div className="flex gap-2 flex-wrap px-6 py-4 bg-nb-secondary border-t-[3px] border-nb-outline">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="h-6 w-6 border-[3px] border-nb-outline bg-nb-primary shadow-nb-sm"
                aria-hidden
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
