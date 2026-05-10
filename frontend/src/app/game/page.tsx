'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, DoorOpen, Hand, Home, TimerReset } from 'lucide-react';
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
import { useNavigationStore } from '@/store/navigationStore';

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
    <main className="mx-auto min-h-screen w-full max-w-[1500px] px-4 pb-8 pt-6 lg:px-6 bg-casino-bg-primary">
      <div className="casino-card border-casino-gold/30 bg-[linear-gradient(135deg,rgba(13,59,47,1),rgba(17,71,58,1))] p-5 shadow-casino-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-casino-text-primary tracking-tight">{roomState.name}</h1>
              <span className="rounded-full border border-casino-gold/30 bg-casino-gold/10 px-3 py-1 text-xs font-bold text-casino-gold capitalize">
                {formatRoomType(roomState.type)}
              </span>
            </div>
            <p className="mt-2 text-casino-text-secondary">
              Current Turn: <span className="font-bold text-casino-gold">{currentPlayer?.nickname ?? '...'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(roomState.code)}
              className="inline-flex items-center gap-2 rounded-full border border-casino-gold/20 bg-black/20 px-4 py-2 text-sm font-medium text-casino-text-primary transition hover:bg-casino-gold/10"
            >
              <Copy className="h-4 w-4 text-casino-gold" />
              {roomState.code}
            </button>
            <Button variant="outline" className="rounded-full" onClick={() => router.replace('/lobby')}>
              Lobby
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" />
              Ke Beranda
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin meninggalkan room?')) {
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
        <div className="mt-6 rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-200">
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

          <div className="casino-card border-casino-gold/15 p-5">
            <GameBoard board={gameState.board} leftEnd={gameState.leftEnd} rightEnd={gameState.rightEnd} />

            {selectedPlacements.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border border-casino-gold/30 bg-casino-gold/10 p-4"
              >
                <p className="font-bold text-casino-text-primary">Select placement side</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'left');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Place Left
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'right');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    Place Right
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="casino-card border-casino-gold/15 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">Hand Section</p>
                  <h2 className="mt-2 text-2xl font-bold text-casino-text-primary">Your Tiles</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-casino-gold/20 bg-black/20 px-4 py-2 text-sm font-medium text-casino-text-secondary">
                    <Hand className="h-4 w-4 text-casino-gold" />
                    {myPlayer.hand.length} tiles
                  </span>
                  <Button variant="outline" className="rounded-full" onClick={passTurn} disabled={!canPass}>
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
            title="Table Chat"
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
