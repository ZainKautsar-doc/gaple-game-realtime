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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020617]/80 p-4 backdrop-blur-md">
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
              className="absolute top-0 h-3 w-3 rounded-sm"
              style={{
                left: `${5 + index * 4}%`,
                backgroundColor: ['#00D9FF', '#39FF14', '#FF4FD8', '#FFD66B'][index % 4],
              }}
            />
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">
            Match Result
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold text-white">
            Permainan Berakhir!
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {isWinner ? 'Kamu jadi pemenang ronde ini.' : 'Ronde selesai, cek peringkat dan skor semua pemain.'}
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-3">
            {result.scores.map((entry) => (
              <div
                key={entry.playerId}
                className={`rounded-[28px] border px-5 py-4 ${
                  entry.rank === 1
                    ? 'border-brand/30 bg-brand/10 shadow-[0_0_30px_rgba(0,217,255,0.12)]'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-lg font-bold text-white">
                      #{entry.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-white">{entry.nickname}</p>
                        {entry.rank === 1 ? <Crown className="h-4 w-4 text-amber-300" /> : null}
                      </div>
                      <p className="text-sm text-slate-400">
                        Sisa kartu: {entry.remainingCards.map((card) => `${card.left}/${card.right}`).join(', ') || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Score</p>
                    <p className="font-mono text-2xl font-bold text-white">{entry.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">
              {countdownLabel
                ? `Otomatis balik ke lobby dalam ${countdownLabel}.`
                : 'Siap balik ke lobby untuk ronde berikutnya.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={onReturnToLobby}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Kembali ke Lobby
              </Button>
              <Button variant="outline" onClick={onLeave}>
                <LogOut className="mr-2 h-4 w-4" />
                Keluar dari Meja
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
