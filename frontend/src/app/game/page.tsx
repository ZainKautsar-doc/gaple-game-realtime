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
const SLOT_ORDER = ['west', 'north', 'east'] as const;
const POSITION_ORDER: Record<string, number> = {
  south: 0,
  west: 1,
  north: 2,
  east: 3,
};

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
    isHost,
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

  // Sort side players relative to my position for a consistent circular view
  const myPosIndex = POSITION_ORDER[myPlayer.position] ?? 0;
  const sidePlayers = [...gameState.players]
    .filter((player) => player.id !== myPlayerId)
    .sort((a, b) => {
      const aIdx = (POSITION_ORDER[a.position] ?? 0) - myPosIndex;
      const bIdx = (POSITION_ORDER[b.position] ?? 0) - myPosIndex;
      
      // Normalize to 1-3 range
      const aNorm = aIdx < 0 ? aIdx + 4 : aIdx;
      const bNorm = bIdx < 0 ? bIdx + 4 : bIdx;
      
      return aNorm - bNorm;
    });

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
    <main className="min-h-screen bg-nb-surface">
      <div className="game-layout">
        {/* ===== TOP BAR ===== */}
        <div className="game-topbar">
          <div className="game-topbar-left">
            <h1>{roomState.name}</h1>
            <span className="border-[3px] border-nb-outline bg-nb-secondary px-3 py-1 font-mono text-[11px] font-bold uppercase text-nb-on-surface">
              {formatRoomType(roomState.type)}
            </span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(roomState.code)}
              className="inline-flex items-center gap-1.5 border-[3px] border-nb-outline bg-nb-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-nb-primary shadow-nb-sm hover:bg-nb-secondary"
            >
              <Copy className="h-3.5 w-3.5" />
              {roomState.code}
            </button>
          </div>
          <div className="game-topbar-actions">
            {isHost && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs uppercase" 
                onClick={() => {
                  if (window.confirm('Kembali ke lobby akan meriset permainan. Lanjutkan?')) {
                    returnToLobby();
                  }
                }}
              >
                Return to Lobby
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-xs uppercase" onClick={() => router.push('/')}>
              <Home className="mr-1.5 h-3.5 w-3.5" />
              Ke Beranda
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs uppercase"
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin meninggalkan room?')) {
                  leaveRoom();
                  router.replace('/');
                }
              }}
            >
              <DoorOpen className="mr-1.5 h-3.5 w-3.5" />
              Leave Table
            </Button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="col-span-full border-[3px] border-nb-outline bg-nb-tertiary px-4 py-3 font-mono text-sm font-bold uppercase text-nb-white">
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
                <span className="animate-nb-pulse border-[3px] border-nb-outline bg-nb-secondary px-3 py-1 font-mono text-[11px] font-bold uppercase text-nb-on-surface">
                  Your Turn
                </span>
              )}
              {isHost && (
                <span className="border-[3px] border-nb-outline bg-nb-primary px-3 py-1 font-mono text-[11px] font-bold uppercase text-nb-white">
                  Host
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
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
            <motion.div initial={false} animate={{ opacity: 1 }} transition={{ duration: 0 }} className="placement-selector">
              <p>Select placement side:</p>
              <Button
                variant="outline"
                size="sm"
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
