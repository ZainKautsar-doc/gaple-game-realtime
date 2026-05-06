'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CornerDownRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { GameBoard } from '@/components/game/GameBoard';
import { GameStatus } from '@/components/game/GameStatus';
import { PlayerAvatar } from '@/components/game/PlayerAvatar';
import { PlayerHand } from '@/components/game/PlayerHand';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/hooks/useGame';

const sideLabels = ['North Seat', 'West Seat', 'East Seat'];

export default function GamePage() {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const {
    nickname,
    roomState,
    gameState,
    myPlayerId,
    myPlayer,
    currentPlayer,
    isMyTurn,
    error,
    messages,
    typingPlayers,
    playableCards,
    leaveRoom,
    playCard,
    passTurn,
    sendChatMessage,
    setTyping,
  } = useGame();

  useEffect(() => {
    if (!nickname) {
      router.replace('/');
    }
  }, [nickname, router]);

  useEffect(() => {
    if (roomState?.status === 'waiting') {
      setSelectedCardId(null);
    }
  }, [roomState?.status]);

  if (!nickname) {
    return null;
  }

  if (!gameState || !myPlayer) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
        <Card className="section-shell w-full">
          <CardHeader>
            <CardTitle>Meja belum aktif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Game state belum siap. Biasanya ini terjadi saat meja kembali ke lobby
              atau kamu baru saja reconnect.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => router.replace('/lobby')}>
                Kembali ke Lobby
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  leaveRoom();
                  router.replace('/');
                }}
              >
                Keluar
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const otherPlayers = gameState.players.filter((player) => player.id !== myPlayerId);
  const selectedPlacements =
    selectedCardId ? playableCards.get(selectedCardId) ?? [] : [];
  const winningPlayer =
    gameState.players.find((player) => player.id === gameState.winner) ?? null;

  const handleSelectCard = (cardId: string) => {
    if (!isMyTurn) {
      return;
    }

    const placements = playableCards.get(cardId) ?? [];
    if (placements.length === 0) {
      return;
    }

    if (placements.length === 1) {
      playCard(cardId, placements[0].side);
      setSelectedCardId(null);
      return;
    }

    setSelectedCardId((current) => (current === cardId ? null : cardId));
  };

  const canPass = isMyTurn && playableCards.size === 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-6 lg:px-6">
      {gameState.status === 'finished' && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={`confetti-${index}`}
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: [0, 1, 1, 0], y: '120vh', x: (index % 2 === 0 ? 1 : -1) * 60 }}
              transition={{
                duration: 3.2,
                delay: index * 0.08,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="absolute top-0 h-3 w-3 rounded-sm"
              style={{
                left: `${5 + index * 4.5}%`,
                backgroundColor: ['#3df5bf', '#6ef3ff', '#ffd66b', '#ff9f67'][index % 4],
              }}
            />
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Live Match
          </p>
          <h1 className="mt-2 font-[var(--font-display)] text-4xl font-bold text-white">
            Gaple Table
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.replace('/lobby')}>
            Back to Lobby
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              leaveRoom();
              router.replace('/');
            }}
          >
            Leave Match
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <GameStatus
            gameState={gameState}
            myPlayer={myPlayer}
            currentPlayer={currentPlayer}
            isMyTurn={isMyTurn}
          />

          <Card className="section-shell">
            <CardHeader className="pb-4">
              <CardTitle>Table Radar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {otherPlayers.map((player, index) => (
                <PlayerAvatar
                  key={player.id}
                  seatLabel={sideLabels[index] ?? `Seat ${index + 1}`}
                  player={player}
                  isCurrentTurn={player.id === currentPlayer?.id}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {otherPlayers.map((player, index) => (
              <PlayerAvatar
                key={`${player.id}-top`}
                seatLabel={sideLabels[index] ?? `Seat ${index + 1}`}
                player={player}
                isCurrentTurn={player.id === currentPlayer?.id}
                className="md:min-h-[132px]"
              />
            ))}
          </div>

          <GameBoard
            board={gameState.board}
            leftEnd={gameState.leftEnd}
            rightEnd={gameState.rightEnd}
          />

          {selectedPlacements.length > 1 && (
            <Card className="section-shell">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <p className="font-semibold text-white">
                    Kartu ini bisa diletakkan di dua sisi.
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Pilih arah placement yang kamu mau.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'left');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Taruh di kiri
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'right');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Taruh di kanan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <PlayerHand
            cards={myPlayer.hand}
            selectedCardId={selectedCardId}
            playableCardIds={new Set(playableCards.keys())}
            onSelectCard={handleSelectCard}
            canInteract={isMyTurn && gameState.status === 'playing'}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div>
              <p className="text-sm text-slate-400">Aksi giliran</p>
              <p className="mt-1 font-semibold text-white">
                {isMyTurn
                  ? 'Sekarang giliranmu. Pilih kartu atau pass jika mentok.'
                  : `Menunggu giliran ${currentPlayer?.nickname ?? 'pemain lain'}.`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={passTurn}
              disabled={!canPass}
            >
              <CornerDownRight className="mr-2 h-4 w-4" />
              Pass Turn
            </Button>
          </div>

          {winningPlayer && (
            <Card className="section-shell border-gold/25 bg-gold/10">
              <CardContent className="p-6">
                <p className="font-[var(--font-display)] text-2xl font-bold text-white">
                  {winningPlayer.nickname} menang.
                </p>
                <p className="mt-2 text-slate-200">
                  Ronde selesai. Kamu bisa kembali ke lobby untuk menunggu meja penuh lagi.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <ChatBox
            title="Table Chat"
            messages={messages}
            typingPlayers={typingPlayers}
            currentPlayerId={myPlayerId}
            onSendMessage={sendChatMessage}
            onTypingChange={setTyping}
          />
        </div>
      </div>
    </main>
  );
}
