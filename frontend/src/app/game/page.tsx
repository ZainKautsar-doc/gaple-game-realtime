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
import Image from 'next/image';

const sideLabels = ['Kursi Utara', 'Kursi Barat', 'Kursi Timur'];

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
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12 bg-[#050a0f]">
        <Card className="section-shell w-full border-white/10 bg-[#0a1219]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Mejanya Belum Siap Cuy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 font-medium">
              Sabar yak, game statenya lagi diproses. Biasanya sih gara-gara balik ke lobby atau lu baru login lagi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => router.replace('/lobby')} className="rounded-full border-brand/50 text-brand-light">
                Balik ke Lobby
              </Button>
              <Button
                variant="danger"
                className="rounded-full"
                onClick={() => {
                  leaveRoom();
                  router.replace('/');
                }}
              >
                Cabut Saja
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
    <main className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-6 lg:px-6 relative bg-[#050a0f]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {gameState.status === 'finished' && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, index) => (
            <motion.div
              key={`confetti-${index}`}
              initial={{ opacity: 0, y: -40, scale: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: '120vh', x: (index % 2 === 0 ? 1 : -1) * (Math.random() * 200), scale: Math.random() * 1.5 + 0.5, rotate: Math.random() * 360 }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: index * 0.1,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="absolute top-0 h-4 w-4 rounded-sm"
              style={{
                backgroundColor: ['#0653b6', '#4a90e2', '#ffd66b', '#39FF14', '#a855f7'][index % 5],
              }}
            />
          ))}
        </div>
      )}

      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0a1219]/80 p-4 backdrop-blur-xl shadow-lg relative z-10">
        <div className="flex items-center gap-3">
           <div className="relative h-8 w-8">
            <Image 
              src="/image/logo/gglogo.svg" 
              alt="Logo" 
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-[var(--font-display)] text-xl font-bold text-white tracking-wide">
                GAPLE ARENA
              </h1>
              <span className="rounded-md bg-brand/20 px-2 py-0.5 text-[10px] font-black text-brand-light border border-brand/30">
                LAGI WAR
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
              Meja: XJ92-K8L
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Giliran</p>
            <p className="text-md font-black text-brand-light">{currentPlayer?.nickname === nickname ? 'LU CUY!' : (currentPlayer?.nickname ?? 'Nunggu...')}</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5 rounded-full text-xs font-bold" onClick={() => router.replace('/lobby')}>
              Lobby
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="rounded-full text-xs font-bold"
              onClick={() => {
                leaveRoom();
                router.replace('/');
              }}
            >
              Cabut
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          {error}
        </motion.div>
      )}

      {/* Main Game Layout */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px] relative z-10">
        {/* Left/Center: Game Board & Players */}
        <div className="flex flex-col gap-6">
          
          {/* Top Opponents row */}
          <div className="grid grid-cols-3 gap-4">
            {otherPlayers.map((player, index) => (
              <PlayerAvatar
                key={`${player.id}-top`}
                seatLabel={sideLabels[index] ?? `Seat ${index + 1}`}
                player={player}
                isCurrentTurn={player.id === currentPlayer?.id}
                className={`md:min-h-[132px] backdrop-blur-md bg-[#0a1219]/80 border-white/10 ${player.id === currentPlayer?.id ? 'border-brand-light/50 shadow-[0_0_20px_rgba(6,83,182,0.2)]' : ''}`}
              />
            ))}
          </div>

          {/* Center Board */}
          <div className="relative rounded-3xl border border-white/10 bg-[#0a1219]/80 p-6 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            
            <div className="relative z-10 flex-1">
              <GameBoard
                board={gameState.board}
                leftEnd={gameState.leftEnd}
                rightEnd={gameState.rightEnd}
              />
            </div>

            {/* Placement Options Overlay */}
            {selectedPlacements.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border border-brand/30 bg-[#0a1219]/95 p-4 shadow-[0_0_30px_rgba(6,83,182,0.3)] backdrop-blur-xl z-20 w-[90%] max-w-md">
                <div className="text-center mb-4">
                  <p className="font-bold text-white">Taruh Mana Nih?</p>
                  <p className="text-xs text-slate-400 font-medium">Kartunya bisa masuk di kiri atau kanan</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-brand/20 hover:border-brand-light hover:text-brand-light transition-all rounded-xl font-bold"
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'left');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Kiri
                  </Button>
                  <Button
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-brand/20 hover:border-brand-light hover:text-brand-light transition-all rounded-xl font-bold"
                    onClick={() => {
                      if (selectedCardId) {
                        playCard(selectedCardId, 'right');
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    Kanan <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Turn Actions & Winner Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-3xl border border-white/10 p-5 backdrop-blur-xl flex items-center justify-between transition-colors ${isMyTurn ? 'bg-gradient-to-r from-brand/10 to-brand-light/5 border-brand/30 shadow-[0_0_20px_rgba(6,83,182,0.15)]' : 'bg-[#0a1219]/80'}`}>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Kabar Giliran</p>
                <p className={`font-bold ${isMyTurn ? 'text-brand-light' : 'text-white'}`}>
                  {isMyTurn
                    ? 'Gas jalanin kartu lu! Kalo zonk ya Pass aja.'
                    : `Sabar, si ${currentPlayer?.nickname ?? '...'} lagi mikir.`}
                </p>
              </div>
              <Button
                variant="outline"
                className={`border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-full font-bold transition-all ${!canPass && 'opacity-50 grayscale cursor-not-allowed'}`}
                onClick={passTurn}
                disabled={!canPass}
              >
                Pass Turn
              </Button>
            </div>

            {winningPlayer ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/20 to-[#0a1219] p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(255,214,107,0.2)]">
                <p className="font-[var(--font-display)] text-xl font-black text-gold">
                  🏆 {winningPlayer.nickname} BANTAI SEMUA!
                </p>
                <p className="mt-1 text-sm text-slate-300 font-medium">
                  Rondenya kelar. Balik ke lobby kuy buat mabar lagi.
                </p>
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#0a1219]/80 p-5 backdrop-blur-xl hidden md:block">
                 <GameStatus
                  gameState={gameState}
                  myPlayer={myPlayer}
                  currentPlayer={currentPlayer}
                  isMyTurn={isMyTurn}
                />
              </div>
            )}
          </div>

          {/* My Hand */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-t from-[#0a1219] to-[#0a1219]/80 p-6 backdrop-blur-xl shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050a0f] border border-white/10 px-4 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-lg">
              KARTU LU NIH
            </div>
            <PlayerHand
              cards={myPlayer.hand}
              selectedCardId={selectedCardId}
              playableCardIds={new Set(playableCards.keys())}
              onSelectCard={handleSelectCard}
              canInteract={isMyTurn && gameState.status === 'playing'}
            />
          </div>
        </div>

        {/* Right Sidebar: Chat */}
        <div className="flex flex-col gap-6 h-full">
          <div className="sticky top-24 h-[calc(100vh-120px)] rounded-3xl border border-white/10 bg-[#0a1219]/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
            <ChatBox
              title="Bacotan Meja"
              messages={messages}
              typingPlayers={typingPlayers}
              currentPlayerId={myPlayerId}
              onSendMessage={sendChatMessage}
              onTypingChange={setTyping}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
