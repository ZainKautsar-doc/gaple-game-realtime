'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, DoorOpen, Hand, TimerReset } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { EndGameScreen } from '@/components/game/EndGameScreen';
import { GameBoard } from '@/components/game/GameBoard';
import { GameLog } from '@/components/game/GameLog';
import { PlayerPanel } from '@/components/game/PlayerPanel';
import { PlayerHand } from '@/components/game/PlayerHand';
import { Button } from '@/components/ui/button';
import { formatRoomType } from '@/lib/game';
import { useGame } from '@/hooks/useGame';

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
    returnToLobby,
    playCard,
    passTurn,
    sendChatMessage,
    setTyping,
    lastResetAt,
  } = useGame();

  useEffect(() => {
    if (!nickname) {
      router.replace('/');
    }
  }, [nickname, router]);

  useEffect(() => {
    if (!gameState && roomState?.status === 'waiting') {
      router.replace('/lobby');
    }
  }, [gameState, roomState?.status, router]);

  useEffect(() => {
    if (lastResetAt) {
      router.replace('/lobby');
    }
  }, [lastResetAt, router]);

  if (!nickname || !roomState || !gameState || !myPlayer) {
    return null;
  }

  const selectedPlacements = selectedCardId ? playableCards.get(selectedCardId) ?? [] : [];
  const canPass = isMyTurn && playableCards.size === 0;
  const sidePlayers = gameState.players.filter((player) => player.id !== myPlayerId);

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

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1500px] px-4 pb-8 pt-6 lg:px-6">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-[var(--font-display)] text-3xl font-bold text-white">{roomState.name}</h1>
              <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand-light">
                {formatRoomType(roomState.type)}
              </span>
            </div>
            <p className="mt-2 text-slate-400">
              Giliran sekarang: <span className="text-white">{currentPlayer?.nickname ?? '...'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(roomState.code)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <Copy className="h-4 w-4 text-brand-light" />
              {roomState.code}
            </button>
            <Button variant="outline" className="rounded-full" onClick={() => router.replace('/lobby')}>
              Lobby
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (window.confirm('Keluar dari room sekarang?')) {
                  leaveRoom();
                  router.replace('/');
                }
              }}
            >
              <DoorOpen className="mr-2 h-4 w-4" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {sidePlayers.map((player) => (
              <PlayerPanel
                key={player.id}
                player={player}
                isCurrentTurn={player.id === currentPlayer?.id}
              />
            ))}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5">
            <GameBoard board={gameState.board} leftEnd={gameState.leftEnd} rightEnd={gameState.rightEnd} />

            {selectedPlacements.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-[28px] border border-brand/25 bg-brand/10 p-4"
              >
                <p className="font-medium text-white">Pilih sisi pemasangan kartu</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'left');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Pasang di Kiri
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'right');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    Pasang di Kanan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">Hand Section</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Kartu Kamu</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-4 py-2 text-sm text-slate-200">
                    <Hand className="h-4 w-4 text-brand-light" />
                    {myPlayer.hand.length} kartu
                  </span>
                  <Button variant="outline" onClick={passTurn} disabled={!canPass}>
                    <TimerReset className="mr-2 h-4 w-4" />
                    Pass
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <PlayerPanel player={myPlayer} isCurrentTurn={isMyTurn} isSelf />
              </div>
              <div className="mt-6">
                <PlayerHand
                  cards={myPlayer.hand}
                  selectedCardId={selectedCardId}
                  playableCardIds={new Set(playableCards.keys())}
                  onSelectCard={handleSelectCard}
                  canInteract={isMyTurn && gameState.status === 'playing'}
                />
              </div>
            </div>

            <GameLog moves={gameState.gameLog} />
          </div>
        </section>

        <aside className="min-h-[620px]">
          <ChatBox
            title="Game Chat"
            messages={messages}
            typingPlayers={typingPlayers}
            currentPlayerId={myPlayerId}
            onSendMessage={sendChatMessage}
            onTypingChange={setTyping}
          />
        </aside>
      </div>

      {gameState.result && (
        <EndGameScreen
          result={gameState.result}
          myPlayerId={myPlayerId}
          onReturnToLobby={returnToLobby}
          onLeave={() => {
            leaveRoom();
            router.replace('/');
          }}
        />
      )}
    </main>
  );
}
