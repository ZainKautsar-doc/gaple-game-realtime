'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Crown, DoorOpen, Home, Play, Power, Users } from 'lucide-react';
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
  const { clearRoomInfo } = useNavigationStore();

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
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-10 pt-8 bg-casino-bg-primary">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="casino-card border-casino-gold/30 bg-[linear-gradient(135deg,rgba(13,59,47,1),rgba(17,71,58,1))] p-6 shadow-casino-lg"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-casino-text-primary tracking-tight">{roomState.name}</h1>
              <span className="rounded-full border border-casino-gold/30 bg-casino-gold/10 px-3 py-1 text-xs font-bold text-casino-gold capitalize">
                {formatRoomType(roomState.type)}
              </span>
            </div>
            <p className="mt-2 text-casino-text-secondary">{roomState.message}</p>
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
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push('/')}
            >
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
              Leave Table
            </Button>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="casino-card border-casino-gold/15 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">Player Management</p>
              <h2 className="mt-2 text-2xl font-bold text-casino-text-primary">Table Seats</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-casino-gold/20 bg-black/20 px-4 py-2 text-sm font-medium text-casino-text-secondary">
                <Users className="h-4 w-4 text-casino-gold" />
                {roomState.currentPlayers}/{roomState.maxPlayers} players
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                  isConnected
                    ? 'border-[#5a8f6a]/30 bg-[#5a8f6a]/10 text-[#5a8f6a]'
                    : 'border-red-900/50 bg-red-900/20 text-red-200'
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

          <div className="mt-6 flex flex-wrap gap-3 rounded-xl border border-casino-gold/15 bg-black/20 p-4 items-center">
            {me && (
              <Button variant={me.isReady ? 'outline' : 'primary'} onClick={() => setReady(!me.isReady)} className="rounded-full px-6">
                {me.isReady ? 'Cancel Ready' : 'I am Ready'}
              </Button>
            )}
            {isHost && (
              <Button variant="primary" onClick={startGame} disabled={!everyoneReady} className="rounded-full px-6">
                <Play className="mr-2 h-4 w-4" />
                Start Game
              </Button>
            )}
            {isHost && !everyoneReady && (
              <p className="self-center text-sm text-casino-text-muted">
                Wait for the table to fill and all players to be ready.
              </p>
            )}
            {isHost && (
              <span className="inline-flex items-center gap-2 rounded-full border border-casino-gold/30 bg-casino-gold/10 px-4 py-2 text-sm font-medium text-casino-gold ml-auto">
                <Crown className="h-4 w-4" />
                Dealer
              </span>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="casino-card border-casino-gold/15 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">Table Info</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-xl border border-casino-gold/10 bg-black/20 p-4">
                <p className="text-xs text-casino-text-muted uppercase">Table Name</p>
                <p className="mt-1 text-lg font-bold text-casino-text-primary">{roomState.name}</p>
              </div>
              <div className="rounded-xl border border-casino-gold/10 bg-black/20 p-4">
                <p className="text-xs text-casino-text-muted uppercase">Type</p>
                <p className="mt-1 text-lg font-bold text-casino-text-primary capitalize">{formatRoomType(roomState.type)}</p>
              </div>
              <div className="rounded-xl border border-casino-gold/10 bg-black/20 p-4">
                <p className="text-xs text-casino-text-muted uppercase">Code</p>
                <p className="mt-1 font-mono text-lg font-bold tracking-[0.2em] text-casino-gold">{roomState.code}</p>
              </div>
              <div className="rounded-xl border border-casino-gold/10 bg-black/20 p-4">
                <p className="text-xs text-casino-text-muted uppercase">Capacity</p>
                <p className="mt-1 text-lg font-bold text-casino-text-primary">{roomState.maxPlayers} players</p>
              </div>
            </div>
          </section>

          <div className="min-h-[420px]">
            <ChatBox
              title="Table Chat"
              messages={messages}
              typingPlayers={typingPlayers}
              currentPlayerId={myPlayerId}
              onSendMessage={sendChatMessage}
              onTypingChange={setTyping}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
