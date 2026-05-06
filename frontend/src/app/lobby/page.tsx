'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Crown, DoorOpen, Play, Power, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatBox } from '@/components/chat/ChatBox';
import { PlayerCard } from '@/components/lobby/PlayerCard';
import { Button } from '@/components/ui/button';
import { formatRoomType } from '@/lib/game';
import { useGame } from '@/hooks/useGame';

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
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-10 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-[var(--font-display)] text-3xl font-bold text-white">{roomState.name}</h1>
              <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand-light">
                {formatRoomType(roomState.type)}
              </span>
            </div>
            <p className="mt-2 text-slate-400">{roomState.message}</p>
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
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                leaveRoom();
                router.replace('/');
              }}
            >
              <DoorOpen className="mr-2 h-4 w-4" />
              Leave Room
            </Button>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">Player Management</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Lobby Seats</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Users className="h-4 w-4 text-brand-light" />
                {roomState.currentPlayers}/{roomState.maxPlayers} pemain
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                  isConnected
                    ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200'
                    : 'border-rose-400/25 bg-rose-400/10 text-rose-100'
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
                          if (window.confirm(`Kick ${player.nickname} dari room ini?`)) {
                            kickPlayer(player.id);
                          }
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 rounded-[28px] border border-white/10 bg-black/15 p-4">
            {me && (
              <Button variant={me.isReady ? 'secondary' : 'primary'} onClick={() => setReady(!me.isReady)}>
                {me.isReady ? 'Batalkan Ready' : 'Saya Ready'}
              </Button>
            )}
            {isHost && (
              <Button onClick={startGame} disabled={!everyoneReady}>
                <Play className="mr-2 h-4 w-4" />
                Start Game
              </Button>
            )}
            {isHost && !everyoneReady && (
              <p className="self-center text-sm text-slate-400">
                Tunggu semua pemain siap dulu sebelum memulai.
              </p>
            )}
            {isHost && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
                <Crown className="h-4 w-4" />
                Kamu host room ini
              </span>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">Room Info</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-sm text-slate-400">Nama Room</p>
                <p className="mt-1 text-lg font-semibold text-white">{roomState.name}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-sm text-slate-400">Tipe</p>
                <p className="mt-1 text-lg font-semibold text-white">{formatRoomType(roomState.type)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-sm text-slate-400">Kode</p>
                <p className="mt-1 font-mono text-lg font-semibold tracking-[0.2em] text-brand-light">{roomState.code}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-sm text-slate-400">Kapasitas</p>
                <p className="mt-1 text-lg font-semibold text-white">{roomState.maxPlayers} pemain</p>
              </div>
            </div>
          </section>

          <div className="min-h-[420px]">
            <ChatBox
              title="Lobby Chat"
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
