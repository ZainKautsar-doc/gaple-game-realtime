'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  DoorOpen,
  Loader2,
  Lock,
  RefreshCcw,
  Search,
  Shield,
  Users,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/hooks/useGame';
import { formatRoomStatus, formatRoomType } from '@/lib/game';
import { useGameStore } from '@/store/gameStore';

interface RoomSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'create' | 'join';
}

export function RoomSetupDialog({
  isOpen,
  onClose,
  defaultMode = 'create',
}: RoomSetupDialogProps) {
  const router = useRouter();
  const { nickname: savedNickname, setNickname } = useGameStore();
  const {
    joinedRoom,
    error,
    rooms,
    lookupResult,
    isRoomsLoading,
    isSubmitting,
    createRoom,
    joinRoom,
    lookupRoom,
    refreshRooms,
  } = useGame();

  const [mode, setMode] = useState<'create' | 'join'>(defaultMode);
  const [playerName, setPlayerName] = useState(savedNickname);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<'public' | 'private'>('public');
  const [maxPlayers, setMaxPlayers] = useState<2 | 3 | 4>(4);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'playing'>('all');
  const [roomCode, setRoomCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joinTargetCode, setJoinTargetCode] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setPlayerName(savedNickname);
      refreshRooms();
    }
  }, [defaultMode, isOpen, refreshRooms, savedNickname]);

  useEffect(() => {
    if (joinedRoom && isOpen) {
      onClose();
      router.push('/lobby');
    }
  }, [isOpen, joinedRoom, onClose, router]);

  useEffect(() => {
    if (lookupResult?.found && lookupResult.room) {
      if (lookupResult.room.type === 'private') {
        setJoinTargetCode(lookupResult.room.code);
      } else {
        setJoinTargetCode(lookupResult.room.code);
      }
    }
  }, [lookupResult]);

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((room) => (statusFilter === 'all' ? true : room.status === statusFilter))
      .sort((left, right) => right.createdAt - left.createdAt);
  }, [rooms, searchQuery, statusFilter]);

  const handleCreateRoom = () => {
    const trimmedPlayerName = playerName.trim();
    const trimmedRoomName = roomName.trim();
    const trimmedPassword = password.trim();

    if (trimmedPlayerName.length < 2 || trimmedPlayerName.length > 20) {
      setLocalError('Nama pemain harus 2-20 karakter.');
      return;
    }

    if (roomType === 'private') {
      if (trimmedPassword.length < 4) {
        setLocalError('Password room private minimal 4 karakter.');
        return;
      }

      if (trimmedPassword !== confirmPassword.trim()) {
        setLocalError('Konfirmasi password belum cocok.');
        return;
      }
    }

    setLocalError(null);
    setNickname(trimmedPlayerName);
    createRoom({
      playerName: trimmedPlayerName,
      roomName: trimmedRoomName,
      type: roomType,
      password: roomType === 'private' ? trimmedPassword : undefined,
      maxPlayers,
    });
  };

  const handleJoinRoom = (code: string, suppliedPassword?: string) => {
    const trimmedPlayerName = playerName.trim();
    if (trimmedPlayerName.length < 2 || trimmedPlayerName.length > 20) {
      setLocalError('Nama pemain harus 2-20 karakter.');
      return;
    }

    setLocalError(null);
    setNickname(trimmedPlayerName);
    joinRoom({
      roomCode: code,
      playerName: trimmedPlayerName,
      password: suppliedPassword?.trim() || undefined,
    });
  };

  const handleLookup = () => {
    if (!roomCode.trim()) {
      setLocalError('Masukkan kode room dulu.');
      return;
    }

    setLocalError(null);
    lookupRoom(roomCode.trim().toUpperCase());
  };

  const activeError = localError ?? error;
  const generatedPreviewCode = roomName
    ? roomName
        .slice(0, 3)
        .toUpperCase()
        .padEnd(3, 'X') + '-AUTO'
    : 'AUTO-ROOM';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#020617]/75 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 top-4 z-[70] mx-auto w-[calc(100%-24px)] max-w-6xl"
          >
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">
                    Matchmaking
                  </p>
                  <h2 className="mt-1 font-[var(--font-display)] text-2xl font-bold text-white">
                    {mode === 'create' ? 'Buat Room Baru' : 'Cari Room Buat Mabar'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="border-b border-white/10 bg-black/10 p-5 lg:border-b-0 lg:border-r">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-2">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        mode === 'create'
                          ? 'bg-gradient-to-r from-brand/30 to-secondary/20 text-white shadow-lg'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                      onClick={() => setMode('create')}
                    >
                      Buat Meja
                      <Shield className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={`mt-2 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        mode === 'join'
                          ? 'bg-gradient-to-r from-brand/30 to-secondary/20 text-white shadow-lg'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                      onClick={() => setMode('join')}
                    >
                      Ikut Room
                      <DoorOpen className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                      Identitas Pemain
                    </p>
                    <label className="mt-4 block text-sm font-medium text-slate-200">
                      Nama Pemain
                    </label>
                    <Input
                      value={playerName}
                      onChange={(event) => setPlayerName(event.target.value)}
                      maxLength={20}
                      placeholder="Masukkan nama lu"
                      className="mt-2"
                    />
                    <p className="mt-3 text-xs text-slate-400">
                      Nama ini dipakai di room, chat, dan leaderboard hasil game.
                    </p>
                  </div>

                  {activeError && (
                    <div className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                      {activeError}
                    </div>
                  )}
                </aside>

                <div className="max-h-[80vh] overflow-y-auto px-6 py-6 custom-scrollbar">
                  {mode === 'create' ? (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-6">
                        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                          <div className="mb-5">
                            <h3 className="text-lg font-semibold text-white">Konfigurasi Room</h3>
                            <p className="mt-1 text-sm text-slate-400">
                              Tentukan room public buat open match atau private buat sirkel sendiri.
                            </p>
                          </div>

                          <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-200">Nama Room</label>
                              <Input
                                value={roomName}
                                onChange={(event) => setRoomName(event.target.value)}
                                maxLength={30}
                                placeholder="Misal: Mabar Jumat Malam"
                                className="mt-2"
                              />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-200">Tipe Room</p>
                              <div className="mt-2 grid grid-cols-2 gap-3">
                                {(['public', 'private'] as const).map((value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                                      roomType === value
                                        ? 'border-brand/40 bg-brand/15 text-white shadow-[0_0_24px_rgba(0,217,255,0.15)]'
                                        : 'border-white/10 bg-black/10 text-slate-300 hover:bg-white/5'
                                    }`}
                                    onClick={() => setRoomType(value)}
                                  >
                                    <p className="font-semibold">{formatRoomType(value)}</p>
                                    <p className="mt-1 text-xs text-slate-400">
                                      {value === 'public'
                                        ? 'Muncul di room browser publik'
                                        : 'Hanya bisa masuk dengan kode dan password'}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-slate-200">Max Players</label>
                              <div className="mt-2 grid grid-cols-3 gap-3">
                                {[2, 3, 4].map((count) => (
                                  <button
                                    key={count}
                                    type="button"
                                    className={`rounded-2xl border px-4 py-4 text-center transition ${
                                      maxPlayers === count
                                        ? 'border-secondary/40 bg-secondary/15 text-white'
                                        : 'border-white/10 bg-black/10 text-slate-300 hover:bg-white/5'
                                    }`}
                                    onClick={() => setMaxPlayers(count as 2 | 3 | 4)}
                                  >
                                    <Users className="mx-auto h-4 w-4" />
                                    <p className="mt-2 font-semibold">{count} Player</p>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {roomType === 'private' && (
                              <>
                                <div>
                                  <label className="text-sm font-medium text-slate-200">Password</label>
                                  <Input
                                    value={password}
                                    type="password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Minimal 4 karakter"
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-200">
                                    Konfirmasi Password
                                  </label>
                                  <Input
                                    value={confirmPassword}
                                    type="password"
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Ulangi password"
                                    className="mt-2"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </section>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            className="rounded-full px-6"
                            onClick={handleCreateRoom}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyiapkan Room...
                              </>
                            ) : (
                              'Create & Join'
                            )}
                          </Button>
                          <Button variant="outline" className="rounded-full px-6" onClick={onClose}>
                            Batal
                          </Button>
                        </div>
                      </div>

                      <aside className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,217,255,0.12),transparent_55%)] p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">
                          Preview Room
                        </p>
                        <div className="mt-5 space-y-4">
                          <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                            <p className="text-xs text-slate-400">Nama Room</p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              {roomName.trim() || 'Room tanpa nama'}
                            </p>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                              <p className="text-xs text-slate-400">Tipe</p>
                              <p className="mt-1 font-semibold text-white">{formatRoomType(roomType)}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                              <p className="text-xs text-slate-400">Maksimal</p>
                              <p className="mt-1 font-semibold text-white">{maxPlayers} pemain</p>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-brand/25 bg-brand/10 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs text-slate-300">Preview Room Code</p>
                                <p className="mt-1 font-mono text-lg font-bold tracking-[0.2em] text-brand-light">
                                  {generatedPreviewCode}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="rounded-full border border-brand/25 p-2 text-brand-light transition hover:bg-brand/15"
                                onClick={() => navigator.clipboard.writeText(generatedPreviewCode)}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </aside>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Public Room Browser</h3>
                            <p className="mt-1 text-sm text-slate-400">
                              Room public aktif akan muncul di sini secara real-time.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="rounded-full"
                            onClick={refreshRooms}
                            disabled={isRoomsLoading}
                          >
                            <RefreshCcw className={`mr-2 h-4 w-4 ${isRoomsLoading ? 'animate-spin' : ''}`} />
                            Refresh
                          </Button>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                              value={searchQuery}
                              onChange={(event) => setSearchQuery(event.target.value)}
                              placeholder="Cari nama room"
                              className="pl-11"
                            />
                          </div>
                          <select
                            value={statusFilter}
                            onChange={(event) =>
                              setStatusFilter(event.target.value as 'all' | 'waiting' | 'playing')
                            }
                            className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-slate-100 outline-none"
                          >
                            <option value="all">Semua status</option>
                            <option value="waiting">Waiting</option>
                            <option value="playing">Playing</option>
                          </select>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {isRoomsLoading &&
                            Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={`room-skeleton-${index}`}
                                className="h-44 animate-pulse rounded-[28px] border border-white/10 bg-white/5"
                              />
                            ))}

                          {!isRoomsLoading && filteredRooms.length === 0 && (
                            <div className="col-span-full rounded-[28px] border border-dashed border-white/10 bg-black/10 px-6 py-12 text-center">
                              <p className="text-lg font-semibold text-white">Belum ada room public</p>
                              <p className="mt-2 text-sm text-slate-400">
                                Coba refresh lagi atau bikin room baru sendiri.
                              </p>
                            </div>
                          )}

                          {!isRoomsLoading &&
                            filteredRooms.map((room) => (
                              <motion.div
                                key={room.roomId}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-lg"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-lg font-semibold text-white">{room.name}</p>
                                    <p className="mt-1 font-mono text-xs tracking-[0.24em] text-brand-light">
                                      {room.code}
                                    </p>
                                  </div>
                                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                    {room.currentPlayers}/{room.maxPlayers}
                                  </div>
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2">
                                  <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-medium text-brand-light">
                                    {formatRoomStatus(room.status)}
                                  </span>
                                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                                    {formatRoomType(room.type)}
                                  </span>
                                </div>
                                <Button
                                  className="mt-6 w-full"
                                  onClick={() => handleJoinRoom(room.code)}
                                  disabled={room.status !== 'waiting' || isSubmitting}
                                >
                                  Join Room
                                </Button>
                              </motion.div>
                            ))}
                        </div>
                      </section>

                      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5 text-brand-light" />
                          <div>
                            <h3 className="text-lg font-semibold text-white">Join dengan Kode</h3>
                            <p className="mt-1 text-sm text-slate-400">
                              Cocok buat masuk ke room private atau room yang tidak kelihatan di browser.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                          <Input
                            value={roomCode}
                            onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                            placeholder="Contoh: AB12CD"
                            className="font-mono tracking-[0.2em]"
                          />
                          <Input
                            value={joinPassword}
                            onChange={(event) => setJoinPassword(event.target.value)}
                            placeholder="Password kalau private"
                            type="password"
                          />
                          <Button onClick={handleLookup} disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cari
                              </>
                            ) : (
                              'Search Room'
                            )}
                          </Button>
                        </div>

                        {lookupResult?.found && lookupResult.room && (
                          <div className="mt-5 rounded-[28px] border border-brand/20 bg-brand/10 p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="text-xl font-semibold text-white">{lookupResult.room.name}</p>
                                <p className="mt-1 text-sm text-slate-300">
                                  {formatRoomType(lookupResult.room.type)} •{' '}
                                  {lookupResult.room.currentPlayers}/{lookupResult.room.maxPlayers} pemain
                                </p>
                              </div>
                              <Button
                                onClick={() =>
                                  handleJoinRoom(lookupResult.room?.code ?? '', joinPassword)
                                }
                                disabled={lookupResult.room.status !== 'waiting' || isSubmitting}
                              >
                                Masuk Room
                              </Button>
                            </div>
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
