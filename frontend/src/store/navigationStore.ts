import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationStore {
  // Room tracking
  currentRoomId: string | null;
  currentRoomCode: string | null;
  playerName: string | null;
  isInRoom: boolean;
  
  // Actions
  setRoomInfo: (roomId: string, roomCode: string, playerName: string) => void;
  clearRoomInfo: () => void;
  
  // Derived state
  getBackToRoomUrl: () => string | null;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      currentRoomId: null,
      currentRoomCode: null,
      playerName: null,
      isInRoom: false,
      
      setRoomInfo: (roomId, roomCode, playerName) =>
        set({
          currentRoomId: roomId,
          currentRoomCode: roomCode,
          playerName: playerName,
          isInRoom: true,
        }),
      
      clearRoomInfo: () =>
        set({
          currentRoomId: null,
          currentRoomCode: null,
          playerName: null,
          isInRoom: false,
        }),
      
      getBackToRoomUrl: () => {
        const { currentRoomId, isInRoom } = get();
        return isInRoom && currentRoomId ? `/lobby` : null; // In this app, it's /lobby or /game, /lobby is safer as entry
      },
    }),
    {
      name: 'navigation-store', // localStorage key
      partialize: (state) => ({
        currentRoomId: state.currentRoomId,
        currentRoomCode: state.currentRoomCode,
        playerName: state.playerName,
        isInRoom: state.isInRoom,
      }),
    }
  )
);
