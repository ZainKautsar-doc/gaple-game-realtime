'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, ChevronLeft, ChevronRight, Copy, DoorOpen, Hand, Home, TimerReset } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { EndGameScreen } from '@/components/game/EndGameScreen';
import { GameBoard } from '@/components/game/GameBoard';
import { GameLog } from '@/components/game/GameLog';
import { PlayerHand } from '@/components/game/PlayerHand';
import { Button } from '@/components/ui/button';
import { formatRoomType, getInitials } from '@/lib/game';
import { useGame } from '@/hooks/useGame';

/* Position mapping for players around the table */
const SLOT_ORDER = ['north', 'west', 'east'] as const;

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
    <main className="bg-casino-bg-primary min-h-screen">
      <div className="game-layout">
        {/* ===== TOP BAR ===== */}
        <div className="game-topbar">
          <div className="game-topbar-left">
            <h1>{roomState.name}</h1>
            <span className="rounded-full border border-casino-gold/30 bg-casino-gold/10 px-3 py-1 text-[11px] font-bold text-casino-gold capitalize">
              {formatRoomType(roomState.type)}
            </span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(roomState.code)}
              className="inline-flex items-center gap-1.5 rounded-full border border-casino-gold/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-casino-text-primary transition hover:bg-casino-gold/10"
            >
              <Copy className="h-3.5 w-3.5 text-casino-gold" />
              {roomState.code}
            </button>
          </div>
          <div className="game-topbar-actions">
            <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => router.replace('/lobby')}>
              Lobby
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => router.push('/')}>
              <Home className="mr-1.5 h-3.5 w-3.5" />
              Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin meninggalkan room?')) {
                  leaveRoom();
                  router.replace('/');
                }
              }}
            >
              <DoorOpen className="mr-1.5 h-3.5 w-3.5" />
              Leave
            </Button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="col-span-full rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* ===== LEFT: Casino Table Area ===== */}
        <div className="casino-table-area">
          <div className="casino-table-container">
            {/* Turn indicator */}
            <div className="turn-indicator">
              <span className="turn-label">Current Turn</span>
              <span className="turn-name">{currentPlayer?.nickname ?? '...'}</span>
            </div>

            {/* Player positions around table */}
            {sidePlayers.map((player, index) => {
              const slotClass = `slot-${SLOT_ORDER[index] ?? 'north'}`;
              return (
                <div key={player.id} className={`table-player-slot ${slotClass}`}>
                  <div className={`player-card-compact ${player.id === currentPlayer?.id ? 'is-active' : ''}`}>
                    <div className="pcc-avatar">{getInitials(player.nickname)}</div>
                    <span className="pcc-name">{player.nickname}</span>
                    <span className="pcc-cards">
                      <span className="pcc-dot" />
                      {player.cardCount} Cards
                    </span>
                    {player.hasPassed && <span className="pcc-badge badge-passed">Passed</span>}
                    {player.isHost && <span className="pcc-badge badge-host">Host</span>}
                  </div>
                </div>
              );
            })}

            {/* Board center with tiles */}
            <div className="board-center">
              <GameBoard board={gameState.board} leftEnd={gameState.leftEnd} rightEnd={gameState.rightEnd} />
            </div>

            {/* Board ends badge */}
            {gameState.leftEnd !== null && gameState.rightEnd !== null && (
              <div className="board-ends-badge">
                {gameState.leftEnd} <ArrowLeftRight className="h-3.5 w-3.5" /> {gameState.rightEnd}
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT: Sidebar (Game Log + Chat) ===== */}
        <div className="game-sidebar">
          {/* Game Log */}
          <div className="sidebar-panel" style={{ flex: '0 0 auto', maxHeight: '260px' }}>
            <div className="sidebar-panel-header">
              <h3>Game Log</h3>
            </div>
            <div className="sidebar-panel-body">
              <GameLog moves={gameState.gameLog} />
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: '1 1 0', minHeight: '300px' }}>
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

        {/* ===== BOTTOM: Player Hand + Actions ===== */}
        <div className="game-bottom">
          <div className="game-bottom-header">
            <div className="game-bottom-title">
              <h2>Your Tiles</h2>
              <div className="tile-count">
                <Hand className="h-3.5 w-3.5" />
                {myPlayer.hand.length} tiles
              </div>
              {isMyTurn && (
                <span className="rounded-full bg-casino-gold/15 border border-casino-gold/30 px-3 py-1 text-[11px] font-bold text-casino-gold uppercase tracking-wider animate-pulse">
                  Your Turn
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={passTurn}
                disabled={!canPass}
              >
                <TimerReset className="mr-1.5 h-4 w-4" />
                Pass
              </Button>
            </div>
          </div>

          {/* Hand cards */}
          <PlayerHand
            cards={myPlayer.hand}
            selectedCardId={selectedCardId}
            playableCardIds={new Set(playableCards.keys())}
            onSelectCard={handleSelectCard}
            canInteract={isMyTurn && gameState.status === 'playing'}
          />

          {/* Side selection if needed */}
          {selectedPlacements.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="placement-selector"
            >
              <p>Select placement side:</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  if (selectedCardId) {
                    playCard(selectedCardId, 'left');
                    setSelectedCardId(null);
                  }
                }}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Left
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  if (selectedCardId) {
                    playCard(selectedCardId, 'right');
                    setSelectedCardId(null);
                  }
                }}
              >
                Right
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* End-game overlay */}
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
