'use client';

import { create } from 'zustand';
import type { ChatMessage, TypingPlayer } from '@/types/game';

interface ChatStore {
  messages: ChatMessage[];
  typingPlayers: TypingPlayer[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setTypingPlayers: (players: TypingPlayer[]) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  typingPlayers: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages.slice(-59), message],
    })),
  setTypingPlayers: (typingPlayers) => set({ typingPlayers }),
  clearChat: () => set({ messages: [], typingPlayers: [] }),
}));

