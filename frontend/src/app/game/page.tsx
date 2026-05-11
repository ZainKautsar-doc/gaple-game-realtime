'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  DoorOpen,
  Hand,
  Home,
  TimerReset,
  MessageSquare,
  ScrollText,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { EndGameScreen } from '@/components/game/EndGameScreen';
import { GameBoard } from '@/components/game/GameBoard';
import { GameLog } from '@/components/game/GameLog';
import { PlayerHand } from '@/components/game/PlayerHand';
import { PlayerPanel } from '@/components/game/PlayerPanel';
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

  const [gameLogOpen, setGameLogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setGameLogOpen(true);
        setChatOpen(true);
      } else {
        setGameLogOpen(false);
        setChatOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const selectedPlacements = selectedCardId
    ? (playableCards.get(selectedCardId) ?? [])
    : [];
  const canPass = isMyTurn && playableCards.size === 0;

  const myPosIndex = POSITION_ORDER[myPlayer.position] ?? 0;
  const otherPlayers = [...gameState.players].filter(
    (player) => player.id !== myPlayerId
  );

  const leftPlayer = otherPlayers.find((p) => {
    const idx = (POSITION_ORDER[p.position] ?? 0) - myPosIndex;
    return (idx < 0 ? idx + 4 : idx) === 1;
  });

  const topPlayer = otherPlayers.find((p) => {
    const idx = (POSITION_ORDER[p.position] ?? 0) - myPosIndex;
    return (idx < 0 ? idx + 4 : idx) === 2;
  });

  const rightPlayer = otherPlayers.find((p) => {
    const idx = (POSITION_ORDER[p.position] ?? 0) - myPosIndex;
    return (idx < 0 ? idx + 4 : idx) === 3;
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
                  if (
                    window.confirm(
                      'Kembali ke lobby akan meriset permainan. Lanjutkan?'
                    )
                  ) {
                    returnToLobby();
                  }
                }}
              >
                Return to Lobby
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-xs uppercase"
              onClick={() => router.push('/')}
            >
              <Home className="mr-1.5 h-3.5 w-3.5" />
              Ke Beranda
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs uppercase"
              onClick={() => {
                if (
                  window.confirm('Apakah Anda yakin ingin meninggalkan room?')
                ) {
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

        {/* ===== LEFT PLAYER ===== */}
        <div className="left-player-area flex flex-col justify-center items-center">
          {leftPlayer && (
            <PlayerPanel
              player={leftPlayer}
              isCurrentTurn={leftPlayer.id === currentPlayer?.id}
              orientation="vertical"
            />
          )}
        </div>

        {/* ===== CENTER AREA (Top Player + Board) ===== */}
        <div className="center-area flex flex-col gap-6">
          {topPlayer && (
            <div className="flex justify-center">
              <PlayerPanel
                player={topPlayer}
                isCurrentTurn={topPlayer.id === currentPlayer?.id}
                orientation="horizontal"
              />
            </div>
          )}

          <div className="casino-table-container">
            {/* Turn indicator */}
            <div className="turn-indicator">
              <span className="turn-label">Current Turn</span>
              <span className="turn-name">
                {currentPlayer?.nickname ?? '...'}
              </span>
            </div>

            {/* Board center with tiles */}
            <div className="board-center">
              <GameBoard
                board={gameState.board}
                leftEnd={gameState.leftEnd}
                rightEnd={gameState.rightEnd}
              />
            </div>

            {/* Board ends badge */}
            {gameState.leftEnd !== null && gameState.rightEnd !== null && (
              <div className="board-ends-badge">
                {gameState.leftEnd} <ArrowLeftRight className="h-3.5 w-3.5" />{' '}
                {gameState.rightEnd}
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT PLAYER ===== */}
        <div className="right-player-area flex flex-col justify-center items-center">
          {rightPlayer && (
            <PlayerPanel
              player={rightPlayer}
              isCurrentTurn={rightPlayer.id === currentPlayer?.id}
              orientation="vertical"
            />
          )}
        </div>

        {/* ===== RIGHT: Sidebar (Game Log + Chat) ===== */}
        {(!isMobile || gameLogOpen || chatOpen) && (
          <>
            {isMobile && (gameLogOpen || chatOpen) && (
              <div
                className="fixed inset-0 bg-nb-on-surface/50 z-40"
                onClick={() => {
                  setGameLogOpen(false);
                  setChatOpen(false);
                }}
              />
            )}

            <AnimatePresence>
              {(!isMobile || gameLogOpen || chatOpen) && (
                <motion.div
                  initial={isMobile ? { x: '100%' } : false}
                  animate={{ x: 0 }}
                  exit={isMobile ? { x: '100%' } : undefined}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`game-sidebar ${isMobile ? 'fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-nb-surface z-50 p-4 border-l-3 border-nb-outline shadow-nb-md overflow-y-auto' : ''}`}
                >
                  {isMobile && (
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-display text-xl uppercase text-nb-primary">
                        {gameLogOpen ? 'Game Log' : 'Chat'}
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGameLogOpen(false);
                          setChatOpen(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {(!isMobile || gameLogOpen) && (
                    <div
                      className="sidebar-panel"
                      style={{
                        flex: isMobile ? '1 1 auto' : '0 0 auto',
                        maxHeight: isMobile ? 'none' : '260px',
                      }}
                    >
                      <div className="sidebar-panel-header">
                        <h3>Game Log</h3>
                      </div>
                      <div className="sidebar-panel-body">
                        <GameLog moves={gameState.gameLog} />
                      </div>
                    </div>
                  )}

                  {(!isMobile || chatOpen) && (
                    <div
                      style={{
                        flex: '1 1 0',
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <ChatBox
                        title="Table Chat"
                        messages={messages}
                        typingPlayers={typingPlayers}
                        currentPlayerId={myPlayerId}
                        onSendMessage={sendChatMessage}
                        onTypingChange={setTyping}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Mobile Toggle Buttons */}
        {isMobile && !gameLogOpen && !chatOpen && (
          <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setGameLogOpen(true)}
              className="border-3 border-nb-outline shadow-nb-sm"
            >
              <ScrollText className="h-4 w-4 mr-2" /> LOG
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setChatOpen(true)}
              className="border-3 border-nb-outline shadow-nb-sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" /> CHAT
            </Button>
          </div>
        )}

        {/* ===== BOTTOM: Player Hand + Actions ===== */}
        <div className="game-bottom shadow-nb-md col-span-full xl:col-span-3">
          <div className="game-bottom-header">
            <div className="game-bottom-title">
              <div className="bg-nb-primary text-nb-white border-[3px] border-nb-outline px-3 py-1 font-display text-sm font-bold uppercase rounded-none">
                {getInitials(myPlayer.nickname)}
              </div>
              <h2>You</h2>
              <span className="font-mono text-sm font-bold ml-2">
                YOUR TURN
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="tile-count">
                {myPlayer.hand.length} cards remaining
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={passTurn}
                disabled={!canPass}
                className="font-display uppercase text-sm border-[3px] border-nb-outline"
              >
                PASS
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
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
              className="placement-selector"
            >
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
