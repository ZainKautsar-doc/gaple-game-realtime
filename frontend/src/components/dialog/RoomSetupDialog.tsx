'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';

interface RoomSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'create' | 'join';
}

export function RoomSetupDialog({ isOpen, onClose, defaultMode = 'create' }: RoomSetupDialogProps) {
  const [mode, setMode] = useState<'create' | 'join'>(defaultMode);
  const [nickname, setLocalNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerCount, setPlayerCount] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { setNickname } = useGameStore();

  // Reset state when mode changes
  const handleModeSwitch = (newMode: 'create' | 'join') => {
    setMode(newMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNick = nickname.trim();
    
    if (trimmedNick.length < 2 || trimmedNick.length > 20) {
      setError('Nama lu kependekan atau kepanjangan, 2-20 huruf yak.');
      return;
    }

    if (mode === 'join' && !roomCode.trim()) {
      setError('Isi dulu kode mejanya, masa kosong.');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate network request for effect
    await new Promise((resolve) => setTimeout(resolve, 800));

    setNickname(trimmedNick);
    // Since backend only supports one main room currently, we just route to lobby
    router.push('/lobby');
    onClose();
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#050a0f]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1219]/95 p-6 shadow-2xl shadow-brand/20 backdrop-blur-xl">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 flex rounded-lg bg-white/5 p-1">
                <button
                  className={`flex-1 rounded-md py-2 text-sm font-bold transition-all ${
                    mode === 'create'
                      ? 'bg-brand text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  onClick={() => handleModeSwitch('create')}
                >
                  Bikin Meja
                </button>
                <button
                  className={`flex-1 rounded-md py-2 text-sm font-bold transition-all ${
                    mode === 'join'
                      ? 'bg-brand text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  onClick={() => handleModeSwitch('join')}
                >
                  Ikut Mabar
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nama Lu Siapa?</label>
                  <Input
                    value={nickname}
                    onChange={(e) => setLocalNickname(e.target.value)}
                    placeholder="Masukin nickname asik lu..."
                    maxLength={20}
                    className="border-white/10 bg-white/5 focus:border-brand-light"
                    autoFocus
                  />
                </div>

                {/* Mode Create forced to 4 players per request */}
                {mode === 'create' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Kapasitas Meja</label>
                    <div className="flex items-center gap-3 rounded-lg border border-brand-light/20 bg-brand/5 p-3">
                      <Users className="h-5 w-5 text-brand-light" />
                      <span className="text-sm font-bold text-white">4 Orang (Standard)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">Meja bakal auto-gas pas udah penuh 4 orang.</p>
                  </div>
                )}

                {mode === 'join' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Kode Meja</label>
                    <Input
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Contoh: XJ92"
                      className="border-white/10 bg-white/5 uppercase tracking-widest focus:border-brand-light"
                    />
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-rose-400 font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="mt-6 w-full bg-brand text-white font-bold hover:bg-brand-light border-none transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Otw Nyambungin...
                    </>
                  ) : mode === 'create' ? (
                    'Gas Bikin Meja'
                  ) : (
                    'Gas Ikut Mabar'
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
