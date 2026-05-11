'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Crown, DoorOpen, Home, MessageSquare, Play, Power, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { PlayerCard } from '@/components/lobby/PlayerCard';
import { Button } from '@/components/ui/button';
import { formatRoomType } from '@/lib/game';
import { useGame } from '@/hooks/useGame';
import { useNavigationStore } from '@/store/navigationStore';

const boardPositions = ['north', 'west', 'east', 'south'] as const;

export default function LobbyPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setChatOpen(true);
      } else {
        setChatOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    nickname,
    roomState,
    gameState,
    myPlayerId,
    isConnected,
    isHost,
    everyoneReady,
    error,
    messages,
    typingPlayers,
    leaveRoom,
    setReady,
    startGame,
    kickPlayer,
    sendChatMessage,
    setTyping,
  } = useGame();

  useEffect(() => {
    if (!nickname) {
      router.replace('/');
    }
  }, [nickname, router]);

  useEffect(() => {
    if (roomState?.status === 'playing' && gameState) {
      router.replace('/game');
    }
  }, [gameState, roomState?.status, router]);

  useEffect(() => {
    if (nickname && !roomState) {
      router.replace('/');
    }
  }, [nickname, roomState, router]);

  if (!nickname || !roomState) {
    return null;
  }

  const me = roomState.players.find((player) => player.id === myPlayerId);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl bg-nb-surface px-4 pb-10 pt-8 md:px-6">
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className="nb-card mb-6"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl uppercase text-nb-primary tracking-wide">{roomState.name}</h1>
              <span className="border-[3px] border-nb-outline bg-nb-secondary px-3 py-1 font-mono text-xs font-bold uppercase text-nb-on-surface">
                {formatRoomType(roomState.type)}
              </span>
            </div>
            <p className="mt-2 font-mono text-sm font-medium text-nb-on-surface">{roomState.message}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(roomState.code)}
              className="inline-flex items-center gap-2 border-[3px] border-nb-outline bg-nb-white px-4 py-2 font-mono text-sm font-bold uppercase text-nb-primary shadow-nb-sm hover:bg-nb-secondary"
            >
              <Copy className="h-4 w-4" />
              {roomState.code}
            </button>
            <Button variant="outline" onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" />
              Ke Beranda
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin meninggalkan room?')) {
                  leaveRoom();
                  router.replace('/');
                }
              }}
            >
              <DoorOpen className="mr-2 h-4 w-4" />
              Leave Table
            </Button>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="border-[3px] border-nb-outline bg-nb-tertiary px-4 py-3 font-mono text-sm font-bold uppercase text-nb-white">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-6">
          <section className="nb-card">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-primary">
                  Player Management
                </p>
                <h2 className="mt-2 font-display text-2xl uppercase text-nb-primary">Table Seats</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border-[3px] border-nb-outline bg-nb-surface-low px-4 py-2 font-mono text-sm font-bold uppercase text-nb-on-surface">
                  <Users className="h-4 w-4 text-nb-primary" />
                  {roomState.currentPlayers}/{roomState.maxPlayers} players
                </span>
                <span
                  className={`inline-flex items-center gap-2 border-[3px] border-nb-outline px-4 py-2 font-mono text-sm font-bold uppercase ${
                    isConnected
                      ? 'bg-nb-secondary text-nb-on-surface'
                      : 'bg-nb-tertiary text-nb-white'
                  }`}
                >
                  <Power className="h-4 w-4" />
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {boardPositions.map((position) => {
                const player = roomState.players.find((item) => item.position === position);
                return (
                  <PlayerCard
                    key={position}
                    player={player}
                    isSelf={player?.id === myPlayerId}
                    showKick={!!player && isHost && player.id !== myPlayerId}
                    onToggleReady={
                      player?.id === myPlayerId && me
                        ? () => setReady(!me.isReady)
                        : undefined
                    }
                    onKick={
                      player && isHost && player.id !== myPlayerId
                        ? () => {
                            if (window.confirm(`Kick ${player.nickname} from the table?`)) {
                              kickPlayer(player.id);
                            }
                          }
                        : undefined
                    }
                  />
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-[3px] border-nb-outline bg-nb-surface-low p-4 items-center">
              {me && (
                <Button variant={me.isReady ? 'outline' : 'primary'} onClick={() => setReady(!me.isReady)} className="px-6">
                  {me.isReady ? 'Cancel Ready' : 'I am Ready'}
                </Button>
              )}
              {isHost && (
                <Button variant="primary" onClick={startGame} disabled={!everyoneReady} className="px-6">
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              )}
              {isHost && !everyoneReady && (
                <p className="self-center font-mono text-sm font-bold uppercase text-nb-placeholder">
                  Wait for all players ready.
                </p>
              )}
              {isHost && (
                <span className="ml-auto inline-flex items-center gap-2 border-[3px] border-nb-outline bg-nb-secondary px-4 py-2 font-mono text-sm font-bold uppercase text-nb-on-surface">
                  <Crown className="h-4 w-4" />
                  Dealer
                </span>
              )}
            </div>
          </section>

          <section className="nb-card">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-primary">Table Info</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-[3px] border-nb-outline bg-nb-surface-low p-4 shadow-nb-sm">
                <p className="font-mono text-xs font-bold uppercase text-nb-placeholder">Table Name</p>
                <p className="mt-2 font-display text-lg uppercase text-nb-primary">{roomState.name}</p>
              </div>
              <div className="border-[3px] border-nb-outline bg-nb-surface-low p-4 shadow-nb-sm">
                <p className="font-mono text-xs font-bold uppercase text-nb-placeholder">Type</p>
                <p className="mt-2 font-display text-lg uppercase text-nb-primary">{formatRoomType(roomState.type)}</p>
              </div>
              <div className="border-[3px] border-nb-outline bg-nb-surface-low p-4 shadow-nb-sm">
                <p className="font-mono text-xs font-bold uppercase text-nb-placeholder">Code</p>
                <p className="mt-2 font-mono text-lg font-bold tracking-[0.15em] text-nb-primary">{roomState.code}</p>
              </div>
              <div className="border-[3px] border-nb-outline bg-nb-surface-low p-4 shadow-nb-sm">
                <p className="font-mono text-xs font-bold uppercase text-nb-placeholder">Capacity</p>
                <p className="mt-2 font-display text-lg uppercase text-nb-primary">{roomState.maxPlayers} players</p>
              </div>
            </div>
          </section>
        </div>

        <AnimatePresence>
          {(!isMobile || chatOpen) && (
            <>
              {isMobile && (
                <div 
                  className="fixed inset-0 bg-nb-on-surface/50 z-40" 
                  onClick={() => setChatOpen(false)}
                />
              )}
              
              <motion.aside
                initial={isMobile ? { x: '100%' } : false}
                animate={{ x: 0 }}
                exit={isMobile ? { x: '100%' } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`lg:sticky lg:top-8 h-fit ${
                  isMobile 
                    ? 'fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-nb-surface z-50 p-4 border-l-3 border-nb-outline shadow-nb-md overflow-y-auto' 
                    : ''
                }`}
              >
                {isMobile && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-display text-xl uppercase text-nb-primary">Chat</h2>
                    <Button variant="outline" size="sm" onClick={() => setChatOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <ChatBox
                  title="Table Chat"
                  messages={messages}
                  typingPlayers={typingPlayers}
                  currentPlayerId={myPlayerId}
                  onSendMessage={sendChatMessage}
                  onTypingChange={setTyping}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Chat Toggle Button */}
        {isMobile && !chatOpen && (
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              variant="primary"
              size="md"
              onClick={() => setChatOpen(true)}
              className="rounded-full h-14 w-14 border-3 border-nb-outline shadow-nb-md"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
