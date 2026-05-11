'use client';

import { create } from 'zustand';
import type { GameStateView, RoomState } from '@/types/game';

interface GameStore {
  nickname: string;
  myPlayerId: string | null;
  roomState: RoomState | null;
  gameState: GameStateView | null;
  isConnected: boolean;
  joinedRoom: boolean;
  error: string | null;
  infoMessage: string | null;
  lastResetAt: number;
  isSetupDialogOpen: boolean;
  setupDialogMode: 'create' | 'join';
  avatarId: string;
  setNickname: (nickname: string) => void;
  setAvatarId: (avatarId: string) => void;
  setMyPlayerId: (playerId: string | null) => void;
  setRoomState: (roomState: RoomState | null) => void;
  setGameState: (gameState: GameStateView | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setJoinedRoom: (joinedRoom: boolean) => void;
  setError: (error: string | null) => void;
  setInfoMessage: (message: string | null) => void;
  markGameReset: () => void;
  clearGameReset: () => void;
  setSetupDialog: (isOpen: boolean, mode?: 'create' | 'join') => void;
  resetSession: () => void;
  rehydrateFromStorage: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  nickname: '',
  myPlayerId: null,
  roomState: null,
  gameState: null,
  isConnected: false,
  joinedRoom: false,
  error: null,
  infoMessage: null,
  lastResetAt: 0,
  isSetupDialogOpen: false,
  setupDialogMode: 'create',
  avatarId: '1',
  setNickname: (nickname) => {
    const trimmedNickname = nickname.slice(0, 20);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gaple-nickname', trimmedNickname);
    }
    set({ nickname: trimmedNickname });
  },
  setAvatarId: (avatarId) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gaple-avatar', avatarId);
    }
    set({ avatarId });
  },
  setMyPlayerId: (myPlayerId) => set({ myPlayerId }),
  setRoomState: (roomState) => set({ roomState }),
  setGameState: (gameState) =>
    set((state) => ({
      gameState,
      lastResetAt: gameState ? 0 : state.lastResetAt,
    })),
  setIsConnected: (isConnected) => set({ isConnected }),
  setJoinedRoom: (joinedRoom) => set({ joinedRoom }),
  setError: (error) => set({ error }),
  setInfoMessage: (infoMessage) => set({ infoMessage }),
  markGameReset: () => set({ gameState: null, lastResetAt: Date.now() }),
  clearGameReset: () => set({ lastResetAt: 0 }),
  setSetupDialog: (isOpen, mode) => set((state) => ({ 
    isSetupDialogOpen: isOpen, 
    setupDialogMode: mode ?? state.setupDialogMode 
  })),
  resetSession: () =>
    set({
      myPlayerId: null,
      roomState: null,
      gameState: null,
      joinedRoom: false,
      error: null,
      infoMessage: null,
      lastResetAt: 0,
    }),
  rehydrateFromStorage: () => {
    if (typeof window === 'undefined') return;
    const savedNickname = window.localStorage.getItem('gaple-nickname') ?? '';
    const savedAvatarId = window.localStorage.getItem('gaple-avatar') ?? '1';
    set({ nickname: savedNickname, avatarId: savedAvatarId });
  },
}));
