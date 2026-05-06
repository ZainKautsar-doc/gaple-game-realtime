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
  setNickname: (nickname: string) => void;
  setMyPlayerId: (playerId: string | null) => void;
  setRoomState: (roomState: RoomState | null) => void;
  setGameState: (gameState: GameStateView | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setJoinedRoom: (joinedRoom: boolean) => void;
  setError: (error: string | null) => void;
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
  resetSession: () =>
    set({
      myPlayerId: null,
      roomState: null,
      gameState: null,
      joinedRoom: false,
      error: null,
    }),
}));

