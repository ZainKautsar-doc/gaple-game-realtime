'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, RefreshCcw } from 'lucide-react';
import { ChatBox } from '@/components/chat/ChatBox';
import { RoomInfo } from '@/components/lobby/RoomInfo';
import { PlayerList } from '@/components/lobby/PlayerList';
import { Button } from '@/components/ui/button';
import { useGame } from '@/hooks/useGame';

export default function LobbyPage() {
  const router = useRouter();
  const {
    nickname,
    roomState,
    gameState,
    myPlayerId,
    currentPlayer,
    isConnected,
    joinedRoom,
    error,
    messages,
    typingPlayers,
    joinMainRoom,
    leaveRoom,
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

  if (!nickname) {
    return null;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Waiting Room
          </p>
          <h1 className="mt-2 font-[var(--font-display)] text-4xl font-bold text-white">
            Halo, {nickname}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          {!joinedRoom && (
            <Button variant="secondary" onClick={joinMainRoom}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Coba Join Lagi
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => {
              leaveRoom();
              router.replace('/');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Leave Room
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <RoomInfo roomState={roomState} isConnected={isConnected} />
          <PlayerList
            players={roomState?.players ?? []}
            currentTurnId={currentPlayer?.id}
            selfId={myPlayerId}
          />
        </div>

        <ChatBox
          title="Lobby Chat"
          messages={messages}
          typingPlayers={typingPlayers}
          currentPlayerId={myPlayerId}
          onSendMessage={sendChatMessage}
          onTypingChange={setTyping}
        />
      </div>
    </main>
  );
}

