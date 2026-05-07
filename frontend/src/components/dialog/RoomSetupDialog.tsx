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
            className="fixed inset-0 z-[60] bg-[#072820]/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 top-4 z-[70] mx-auto w-[calc(100%-24px)] max-w-6xl"
          >
            <div className="overflow-hidden rounded-[16px] border border-casino-gold/30 bg-casino-bg-primary shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-casino-gold/15 bg-casino-bg-surface px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">
                    Matchmaking
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-casino-text-primary">
                    {mode === 'create' ? 'Create a Table' : 'Find a Table'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-casino-gold/20 p-2 text-casino-text-secondary transition hover:bg-casino-gold/10 hover:text-casino-gold"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="border-b border-casino-gold/15 bg-casino-bg-secondary p-5 lg:border-b-0 lg:border-r">
                  <div className="rounded-xl border border-casino-gold/10 bg-casino-bg-surface p-2">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                        mode === 'create'
                          ? 'bg-gradient-to-r from-casino-gold to-casino-gold-dark text-casino-bg-primary shadow-lg'
                          : 'text-casino-text-secondary hover:bg-casino-gold/10'
                      }`}
                      onClick={() => setMode('create')}
                    >
                      Host Table
                      <Shield className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={`mt-2 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                        mode === 'join'
                          ? 'bg-gradient-to-r from-casino-gold to-casino-gold-dark text-casino-bg-primary shadow-lg'
                          : 'text-casino-text-secondary hover:bg-casino-gold/10'
                      }`}
                      onClick={() => setMode('join')}
                    >
                      Join Table
                      <DoorOpen className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 rounded-xl border border-casino-gold/10 bg-casino-bg-surface p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-text-muted">
                      Player Identity
                    </p>
                    <label className="mt-4 block text-sm font-medium text-casino-text-primary">
                      Alias
                    </label>
                    <Input
                      value={playerName}
                      onChange={(event) => setPlayerName(event.target.value)}
                      maxLength={20}
                      placeholder="Enter your alias"
                      className="mt-2"
                    />
                    <p className="mt-3 text-xs text-casino-text-secondary">
                      This name will be displayed at the table.
                    </p>
                  </div>

                  {activeError && (
                    <div className="mt-4 rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-200">
                      {activeError}
                    </div>
                  )}
                </aside>

                <div className="max-h-[80vh] overflow-y-auto px-6 py-6 custom-scrollbar bg-casino-bg-primary">
                  {mode === 'create' ? (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-6">
                        <section className="casino-card p-6">
                          <div className="mb-5">
                            <h3 className="text-lg font-bold text-casino-text-primary">Table Configuration</h3>
                            <p className="mt-1 text-sm text-casino-text-secondary">
                              Set up a public table for open play or a private one for your circle.
                            </p>
                          </div>

                          <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-casino-text-primary">Table Name</label>
                              <Input
                                value={roomName}
                                onChange={(event) => setRoomName(event.target.value)}
                                maxLength={30}
                                placeholder="e.g. High Rollers"
                                className="mt-2"
                              />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-casino-text-primary">Visibility</p>
                              <div className="mt-2 grid grid-cols-2 gap-3">
                                {(['public', 'private'] as const).map((value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    className={`rounded-xl border p-4 text-left transition ${
                                      roomType === value
                                        ? 'border-casino-gold bg-casino-gold/10 text-casino-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                        : 'border-casino-gold/15 bg-black/20 text-casino-text-secondary hover:bg-casino-gold/5'
                                    }`}
                                    onClick={() => setRoomType(value)}
                                  >
                                    <p className="font-bold capitalize">{formatRoomType(value)}</p>
                                    <p className="mt-1 text-xs text-casino-text-muted">
                                      {value === 'public'
                                        ? 'Listed in the lobby'
                                        : 'Code & password required'}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {roomType === 'private' && (
                              <>
                                <div>
                                  <label className="text-sm font-medium text-casino-text-primary">Password</label>
                                  <Input
                                    value={password}
                                    type="password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Min. 4 characters"
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-casino-text-primary">
                                    Confirm Password
                                  </label>
                                  <Input
                                    value={confirmPassword}
                                    type="password"
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Repeat password"
                                    className="mt-2"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </section>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="primary"
                            className="rounded-lg px-8 py-3"
                            onClick={handleCreateRoom}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting up Table...
                              </>
                            ) : (
                              'Host & Join Table'
                            )}
                          </Button>
                          <Button variant="outline" className="rounded-lg px-8 py-3" onClick={onClose}>
                            Cancel
                          </Button>
                        </div>
                      </div>

                      <aside className="casino-card p-6 bg-[linear-gradient(135deg,rgba(13,59,47,1),rgba(17,71,58,1))]">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">
                          Table Preview
                        </p>
                        <div className="mt-5 space-y-4">
                          <div className="rounded-xl border border-casino-gold/15 bg-black/20 p-4">
                            <p className="text-xs text-casino-text-muted uppercase">Table Name</p>
                            <p className="mt-1 text-lg font-bold text-casino-text-primary">
                              {roomName.trim() || 'Unnamed Table'}
                            </p>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-xl border border-casino-gold/15 bg-black/20 p-4">
                              <p className="text-xs text-casino-text-muted uppercase">Type</p>
                              <p className="mt-1 font-bold text-casino-text-primary">{formatRoomType(roomType)}</p>
                            </div>
                            <div className="rounded-xl border border-casino-gold/15 bg-black/20 p-4">
                              <p className="text-xs text-casino-text-muted uppercase">Capacity</p>
                              <p className="mt-1 font-bold text-casino-text-primary">4 players</p>
                            </div>
                          </div>
                          <div className="rounded-xl border border-casino-gold/30 bg-casino-gold/5 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs text-casino-gold uppercase">Access Code</p>
                                <p className="mt-1 font-mono text-lg font-bold tracking-[0.2em] text-casino-text-primary">
                                  {generatedPreviewCode}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="rounded-full border border-casino-gold/30 p-2 text-casino-gold transition hover:bg-casino-gold/10"
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
                      <section className="casino-card p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-casino-text-primary">Active Tables</h3>
                            <p className="mt-1 text-sm text-casino-text-secondary">
                              Join a public table to start playing immediately.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="rounded-lg"
                            onClick={refreshRooms}
                            disabled={isRoomsLoading}
                          >
                            <RefreshCcw className={`mr-2 h-4 w-4 ${isRoomsLoading ? 'animate-spin' : ''}`} />
                            Refresh
                          </Button>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-casino-text-muted" />
                            <Input
                              value={searchQuery}
                              onChange={(event) => setSearchQuery(event.target.value)}
                              placeholder="Search table name"
                              className="pl-11"
                            />
                          </div>
                          <select
                            value={statusFilter}
                            onChange={(event) =>
                              setStatusFilter(event.target.value as 'all' | 'waiting' | 'playing')
                            }
                            className="input-casino h-12"
                          >
                            <option value="all">All Status</option>
                            <option value="waiting">Waiting</option>
                            <option value="playing">Playing</option>
                          </select>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {isRoomsLoading &&
                            Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={`room-skeleton-${index}`}
                                className="h-44 animate-pulse rounded-[16px] border border-casino-gold/10 bg-casino-bg-surface"
                              />
                            ))}

                          {!isRoomsLoading && filteredRooms.length === 0 && (
                            <div className="col-span-full rounded-[16px] border border-dashed border-casino-gold/20 bg-black/20 px-6 py-12 text-center">
                              <p className="text-lg font-bold text-casino-text-primary">No public tables available</p>
                              <p className="mt-2 text-sm text-casino-text-secondary">
                                Refresh the list or host a new table.
                              </p>
                            </div>
                          )}

                          {!isRoomsLoading &&
                            filteredRooms.map((room) => (
                              <motion.div
                                key={room.roomId}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-[16px] border border-casino-gold/15 bg-casino-bg-surface p-5 shadow-casino-sm hover:border-casino-gold/30 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-lg font-bold text-casino-text-primary">{room.name}</p>
                                    <p className="mt-1 font-mono text-xs tracking-[0.2em] text-casino-gold">
                                      {room.code}
                                    </p>
                                  </div>
                                  <div className="rounded-lg border border-casino-gold/20 bg-black/30 px-3 py-1 text-xs font-bold text-casino-text-secondary">
                                    {room.currentPlayers}/{room.maxPlayers}
                                  </div>
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2">
                                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                    room.status === 'waiting' ? 'border-[#5a8f6a] text-[#5a8f6a] bg-[#5a8f6a]/10' : 'border-casino-gold text-casino-gold bg-casino-gold/10'
                                  }`}>
                                    {formatRoomStatus(room.status)}
                                  </span>
                                  <span className="rounded-full border border-casino-gold/20 bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-casino-text-secondary">
                                    {formatRoomType(room.type)}
                                  </span>
                                </div>
                                <Button
                                  variant="primary"
                                  className="mt-6 w-full rounded-lg"
                                  onClick={() => handleJoinRoom(room.code)}
                                  disabled={room.status !== 'waiting' || isSubmitting}
                                >
                                  Join Table
                                </Button>
                              </motion.div>
                            ))}
                        </div>
                      </section>

                      <section className="casino-card p-6">
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5 text-casino-gold" />
                          <div>
                            <h3 className="text-lg font-bold text-casino-text-primary">Join via Code</h3>
                            <p className="mt-1 text-sm text-casino-text-secondary">
                              Enter an access code to join a private table.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                          <Input
                            value={roomCode}
                            onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                            placeholder="e.g. AB12CD"
                            className="font-mono tracking-[0.2em]"
                          />
                          <Input
                            value={joinPassword}
                            onChange={(event) => setJoinPassword(event.target.value)}
                            placeholder="Password (if private)"
                            type="password"
                          />
                          <Button variant="outline" onClick={handleLookup} disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching
                              </>
                            ) : (
                              'Search Table'
                            )}
                          </Button>
                        </div>

                        {lookupResult?.found && lookupResult.room && (
                          <div className="mt-5 rounded-xl border border-casino-gold/30 bg-casino-gold/5 p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="text-xl font-bold text-casino-text-primary">{lookupResult.room.name}</p>
                                <p className="mt-1 text-sm text-casino-text-secondary">
                                  {formatRoomType(lookupResult.room.type)} •{' '}
                                  {lookupResult.room.currentPlayers}/{lookupResult.room.maxPlayers} players
                                </p>
                              </div>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  handleJoinRoom(lookupResult.room?.code ?? '', joinPassword)
                                }
                                disabled={lookupResult.room.status !== 'waiting' || isSubmitting}
                              >
                                Join Table
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
