'use client';

import { create } from 'zustand';
import type { GameStateView, RoomState } from '@/types/game';

const initialNickname =
  typeof window !== 'undefined'
    ? window.localStorage.getItem('gaple-nickname') ?? ''
    : '';

interface GameStore {
  nickname: string;
  myPlayerId: string | null;
  roomState: RoomState | null;
  gameState: GameStateView | null;
  isConnected: boolean;
  joinedRoom: boolean;
  error: string | null;
  isSetupDialogOpen: boolean;
  setupDialogMode: 'create' | 'join';
  setNickname: (nickname: string) => void;
  setMyPlayerId: (playerId: string | null) => void;
  setRoomState: (roomState: RoomState | null) => void;
  setGameState: (gameState: GameStateView | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setJoinedRoom: (joinedRoom: boolean) => void;
  setError: (error: string | null) => void;
  setSetupDialog: (isOpen: boolean, mode?: 'create' | 'join') => void;
  resetSession: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  nickname: initialNickname,
  myPlayerId: null,
  roomState: null,
  gameState: null,
  isConnected: false,
  joinedRoom: false,
  error: null,
  isSetupDialogOpen: false,
  setupDialogMode: 'create',
  setNickname: (nickname) => {
    const trimmedNickname = nickname.slice(0, 18);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gaple-nickname', trimmedNickname);
    }
    set({ nickname: trimmedNickname });
  },
  setMyPlayerId: (myPlayerId) => set({ myPlayerId }),
  setRoomState: (roomState) => set({ roomState }),
  setGameState: (gameState) => set({ gameState }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setJoinedRoom: (joinedRoom) => set({ joinedRoom }),
  setError: (error) => set({ error }),
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
    }),
}));

