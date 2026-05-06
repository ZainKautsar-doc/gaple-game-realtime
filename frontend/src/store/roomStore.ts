'use client';

import { create } from 'zustand';
import type { RoomLookupResult, RoomSummary } from '@/types/game';

interface RoomStore {
  rooms: RoomSummary[];
  lookupResult: RoomLookupResult | null;
  isRoomsLoading: boolean;
  isSubmitting: boolean;
  setRooms: (rooms: RoomSummary[]) => void;
  setLookupResult: (result: RoomLookupResult | null) => void;
  setRoomsLoading: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  resetRoomUi: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  lookupResult: null,
  isRoomsLoading: false,
  isSubmitting: false,
  setRooms: (rooms) => set({ rooms, isRoomsLoading: false }),
  setLookupResult: (lookupResult) => set({ lookupResult }),
  setRoomsLoading: (isRoomsLoading) => set({ isRoomsLoading }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  resetRoomUi: () =>
    set({
      lookupResult: null,
      isRoomsLoading: false,
      isSubmitting: false,
    }),
}));
