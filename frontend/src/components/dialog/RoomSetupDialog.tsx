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
import { AVATAR_TEMPLATES } from '@/lib/avatars';
import { Avatar } from '@/components/ui/avatar';

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
  const { nickname: savedNickname, setNickname, avatarId: savedAvatarId, setAvatarId } = useGameStore();
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
  const [localAvatarId, setLocalAvatarId] = useState(savedAvatarId);
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
      setLocalAvatarId(savedAvatarId);
      refreshRooms();
    }
  }, [defaultMode, isOpen, refreshRooms, savedNickname, savedAvatarId]);

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
    setAvatarId(localAvatarId);
    createRoom({
      playerName: trimmedPlayerName,
      roomName: trimmedRoomName,
      type: roomType,
      password: roomType === 'private' ? trimmedPassword : undefined,
      avatarId: localAvatarId,
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
    setAvatarId(localAvatarId);
    joinRoom({
      roomCode: code,
      playerName: trimmedPlayerName,
      password: suppliedPassword?.trim() || undefined,
      avatarId: localAvatarId,
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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-[#1a1b26]/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[70]"
          >
            <div className="flex h-full flex-col border-[3px] border-nb-outline bg-nb-white shadow-nb-md">
              <div className="flex items-center justify-between border-b-[3px] border-nb-outline bg-nb-primary px-6 py-5">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-secondary">
                    Matchmaking
                  </p>
                  <h2 className="mt-1 font-display text-2xl uppercase text-nb-white">
                    {mode === 'create' ? 'Create a Table' : 'Find a Table'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="border-[3px] border-nb-outline bg-nb-tertiary p-2 text-nb-white shadow-nb-sm hover:bg-nb-secondary hover:text-nb-on-surface"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)] overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                <aside className="border-b-[3px] border-nb-outline bg-nb-surface-low p-5 lg:border-b-0 lg:border-r-[3px] lg:border-nb-outline">
                  <div className="border-[3px] border-nb-outline bg-nb-white p-2 shadow-nb-sm">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between border-[3px] border-nb-outline px-4 py-3 text-left font-mono text-sm font-bold uppercase shadow-nb-sm ${
                        mode === 'create'
                          ? 'bg-nb-secondary text-nb-on-surface'
                          : 'bg-nb-white text-nb-on-surface hover:bg-nb-primary hover:text-nb-white'
                      }`}
                      onClick={() => setMode('create')}
                    >
                      Host Table
                      <Shield className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={`mt-2 flex w-full items-center justify-between border-[3px] border-nb-outline px-4 py-3 text-left font-mono text-sm font-bold uppercase shadow-nb-sm ${
                        mode === 'join'
                          ? 'bg-nb-secondary text-nb-on-surface'
                          : 'bg-nb-white text-nb-on-surface hover:bg-nb-primary hover:text-nb-white'
                      }`}
                      onClick={() => setMode('join')}
                    >
                      Join Table
                      <DoorOpen className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 border-[3px] border-nb-outline bg-nb-white p-5 shadow-nb-sm">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-placeholder">
                      Player Identity
                    </p>
                    <label className="mt-4 block font-mono text-sm font-bold uppercase text-nb-on-surface">
                      Alias
                    </label>
                    <Input
                      value={playerName}
                      onChange={(event) => setPlayerName(event.target.value)}
                      maxLength={20}
                      placeholder="Enter your alias"
                      className="mt-2"
                    />
                    <p className="mt-3 font-mono text-xs font-medium text-nb-on-surface">
                      This name will be displayed at the table.
                    </p>

                    <label className="mt-6 block font-mono text-sm font-bold uppercase text-nb-on-surface">
                      Avatar
                    </label>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                      {AVATAR_TEMPLATES.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setLocalAvatarId(avatar.id)}
                          className={`flex aspect-square items-center justify-center border-[3px] shadow-nb-sm transition-all ${
                            localAvatarId === avatar.id
                              ? 'border-nb-primary bg-nb-secondary scale-110 z-10'
                              : 'border-nb-outline bg-nb-white hover:bg-nb-surface-low'
                          }`}
                          title={avatar.label}
                        >
                          <span className="text-xl">{avatar.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeError && (
                    <div className="mt-4 border-[3px] border-nb-outline bg-nb-tertiary px-4 py-3 font-mono text-sm font-bold uppercase text-nb-white">
                      {activeError}
                    </div>
                  )}
                </aside>

                <div className="px-6 py-6 bg-nb-surface">
                  {mode === 'create' ? (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-6">
                        <section className="nb-card">
                          <div className="mb-5">
                            <h3 className="font-display text-lg uppercase text-nb-primary">Table Configuration</h3>
                            <p className="mt-2 font-mono text-sm font-medium text-nb-on-surface">
                              Set up a public table for open play or a private one for your circle.
                            </p>
                          </div>

                          <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <label className="font-mono text-sm font-bold uppercase text-nb-on-surface">
                                Table Name
                              </label>
                              <Input
                                value={roomName}
                                onChange={(event) => setRoomName(event.target.value)}
                                maxLength={30}
                                placeholder="e.g. High Rollers"
                                className="mt-2"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <p className="font-mono text-sm font-bold uppercase text-nb-on-surface">
                                Visibility
                              </p>
                              <div className="mt-2 grid grid-cols-2 gap-3">
                                {(['public', 'private'] as const).map((value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    className={`border-[3px] border-nb-outline p-4 text-left font-mono shadow-nb-sm ${
                                      roomType === value
                                        ? 'bg-nb-secondary text-nb-on-surface'
                                        : 'bg-nb-white text-nb-on-surface hover:bg-nb-surface-low'
                                    }`}
                                    onClick={() => setRoomType(value)}
                                  >
                                    <p className="font-bold uppercase">{formatRoomType(value)}</p>
                                    <p className="mt-2 text-xs font-medium text-nb-placeholder uppercase">
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
                                  <label className="font-mono text-sm font-bold uppercase text-nb-on-surface">
                                    Password
                                  </label>
                                  <Input
                                    value={password}
                                    type="password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Min. 4 characters"
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <label className="font-mono text-sm font-bold uppercase text-nb-on-surface">
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
                          <Button variant="primary" className="px-8 py-3" onClick={handleCreateRoom} disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting up Table...
                              </>
                            ) : (
                              'Host & Join Table'
                            )}
                          </Button>
                          <Button variant="outline" className="px-8 py-3" onClick={onClose}>
                            Cancel
                          </Button>
                        </div>
                      </div>

                      <aside className="nb-card bg-nb-secondary">
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-on-surface">
                          Table Preview
                        </p>
                        <div className="mt-5 space-y-4">
                          <div className="border-[3px] border-nb-outline bg-nb-white p-4 shadow-nb-sm">
                            <p className="font-mono text-xs font-bold uppercase text-nb-placeholder">
                              Table Name
                            </p>
                            <p className="mt-2 font-display text-lg uppercase text-nb-primary">
                              {roomName.trim() || 'Unnamed Table'}
                            </p>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="border-[3px] border-nb-outline bg-nb-white p-4 shadow-nb-sm">
                              <p className="font-mono text-xs font-bold uppercase text-nb-placeholder">Type</p>
                              <p className="mt-2 font-mono font-bold uppercase text-nb-on-surface">
                                {formatRoomType(roomType)}
                              </p>
                            </div>
                            <div className="border-[3px] border-nb-outline bg-nb-white p-4 shadow-nb-sm">
                              <p className="font-mono text-xs font-bold uppercase text-nb-placeholder">Capacity</p>
                              <p className="mt-2 font-mono font-bold uppercase text-nb-on-surface">4 players</p>
                            </div>
                          </div>
                          <div className="border-[3px] border-nb-outline bg-nb-primary p-4 shadow-nb-sm">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-mono text-xs font-bold uppercase text-nb-secondary">
                                  Access Code
                                </p>
                                <p className="mt-2 font-mono text-lg font-bold tracking-[0.15em] text-nb-white">
                                  {generatedPreviewCode}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="border-[3px] border-nb-outline bg-nb-secondary p-2 text-nb-primary shadow-nb-sm hover:bg-nb-white"
                                onClick={() => navigator.clipboard.writeText(generatedPreviewCode)}
                                aria-label="Copy code"
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
                      <section className="nb-card">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <h3 className="font-display text-lg uppercase text-nb-primary">Active Tables</h3>
                            <p className="mt-2 font-mono text-sm font-medium text-nb-on-surface">
                              Join a public table to start playing immediately.
                            </p>
                          </div>
                          <Button variant="outline" onClick={refreshRooms} disabled={isRoomsLoading}>
                            <RefreshCcw className={`mr-2 h-4 w-4 ${isRoomsLoading ? 'animate-spin' : ''}`} />
                            Refresh
                          </Button>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nb-placeholder" />
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
                            className="nb-input h-12"
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
                                className="h-44 animate-nb-pulse border-[3px] border-nb-outline bg-nb-surface-low"
                              />
                            ))}

                          {!isRoomsLoading && filteredRooms.length === 0 && (
                            <div className="col-span-full border-[3px] border-dashed border-nb-outline bg-nb-white px-6 py-12 text-center shadow-nb-sm">
                              <p className="font-display text-lg uppercase text-nb-primary">
                                No public tables available
                              </p>
                              <p className="mt-3 font-mono text-sm font-bold uppercase text-nb-on-surface">
                                Refresh the list or host a new table.
                              </p>
                            </div>
                          )}

                          {!isRoomsLoading &&
                            filteredRooms.map((room) => (
                              <motion.div
                                key={room.roomId}
                                initial={false}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0 }}
                                className="border-[3px] border-nb-outline bg-nb-white p-5 shadow-nb-sm hover:bg-nb-surface-low"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-display text-lg uppercase text-nb-primary">{room.name}</p>
                                    <p className="mt-2 font-mono text-xs font-bold tracking-[0.15em] text-nb-primary">
                                      {room.code}
                                    </p>
                                  </div>
                                  <div className="border-[3px] border-nb-outline bg-nb-secondary px-3 py-1 font-mono text-xs font-bold uppercase text-nb-on-surface">
                                    {room.currentPlayers}/{room.maxPlayers}
                                  </div>
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2">
                                  <span
                                    className={`border-[3px] border-nb-outline px-3 py-1 font-mono text-xs font-bold uppercase ${
                                      room.status === 'waiting'
                                        ? 'bg-nb-secondary text-nb-on-surface'
                                        : 'bg-nb-primary text-nb-white'
                                    }`}
                                  >
                                    {formatRoomStatus(room.status)}
                                  </span>
                                  <span className="border-[3px] border-nb-outline bg-nb-surface px-3 py-1 font-mono text-xs font-bold uppercase text-nb-on-surface">
                                    {formatRoomType(room.type)}
                                  </span>
                                </div>
                                <Button
                                  variant="primary"
                                  className="mt-6 w-full"
                                  onClick={() => handleJoinRoom(room.code)}
                                  disabled={room.status !== 'waiting' || isSubmitting}
                                >
                                  Join Table
                                </Button>
                              </motion.div>
                            ))}
                        </div>
                      </section>

                      <section className="nb-card">
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5 text-nb-primary" />
                          <div>
                            <h3 className="font-display text-lg uppercase text-nb-primary">Join via Code</h3>
                            <p className="mt-2 font-mono text-sm font-medium text-nb-on-surface">
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
                          <div className="mt-5 border-[3px] border-nb-outline bg-nb-secondary p-5 shadow-nb-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="font-display text-xl uppercase text-nb-primary">
                                  {lookupResult.room.name}
                                </p>
                                <p className="mt-2 font-mono text-sm font-bold uppercase text-nb-on-surface">
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
