'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlayableMap } from '@/lib/game';
import { useChatStore } from '@/store/chatStore';
import { useGameStore } from '@/store/gameStore';
import { useRoomStore } from '@/store/roomStore';
import { useNavigationStore } from '@/store/navigationStore';
import type {
  BoardSide,
  ChatMessage,
  GameStateView,
  RoomLookupResult,
  RoomState,
  RoomSummary,
  TypingPlayer,
} from '@/types/game';
import { useSocket } from './useSocket';

export function useGame() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const {
    nickname,
    myPlayerId,
    roomState,
    gameState,
    joinedRoom,
    error,
    infoMessage,
    lastResetAt,
    setMyPlayerId,
    setRoomState,
    setGameState,
    setIsConnected,
    setJoinedRoom,
    setError,
    setInfoMessage,
    markGameReset,
    clearGameReset,
    resetSession,
  } = useGameStore();
  const {
    rooms,
    lookupResult,
    isRoomsLoading,
    isSubmitting,
    setRooms,
    setLookupResult,
    setRoomsLoading,
    setSubmitting,
    resetRoomUi,
  } = useRoomStore();
  const {
    messages,
    typingPlayers,
    setMessages,
    addMessage,
    setTypingPlayers,
    clearChat,
  } = useChatStore();

  useEffect(() => {
    setIsConnected(isConnected);
  }, [isConnected, setIsConnected]);

  const myPlayer = gameState?.players.find((player) => player.id === myPlayerId) ?? null;
  const currentPlayer = gameState?.players[gameState.currentTurnIndex] ?? null;
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const playableCards = getPlayableMap(myPlayer?.hand ?? [], gameState);
  const isHost = roomState?.hostId === myPlayerId;
  const everyoneReady =
    !!roomState &&
    roomState.players.length === roomState.maxPlayers &&
    roomState.players.every((player) => player.isReady);

  const ensureConnected = useCallback(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, [socket]);

  const createRoom = (payload: {
    playerName: string;
    roomName?: string;
    type: 'public' | 'private';
    password?: string;
    avatarId: string;
  }) => {
    ensureConnected();
    setSubmitting(true);
    setError(null);
    socket.emit('create-room', payload);
  };

  const joinRoom = (payload: {
    roomCode: string;
    playerName: string;
    password?: string;
    avatarId: string;
  }) => {
    ensureConnected();
    setSubmitting(true);
    setError(null);
    socket.emit('join-room', payload);
  };

  const lookupRoom = (roomCode: string) => {
    ensureConnected();
    setSubmitting(true);
    setLookupResult(null);
    socket.emit('lookup-room', { roomCode });
  };

  const refreshRooms = useCallback(() => {
    ensureConnected();
    setRoomsLoading(true);
    socket.emit('get-rooms');
  }, [ensureConnected, setRoomsLoading, socket]);

  const leaveRoom = () => {
    socket.emit('leave-room');
    resetRoomUi();
    clearChat();
    resetSession();
    useNavigationStore.getState().clearRoomInfo();
  };

  const setReady = (value: boolean) => {
    socket.emit('set-ready', { isReady: value });
  };

  const startGame = () => {
    socket.emit('start-game');
  };

  const kickPlayer = (playerId: string) => {
    socket.emit('kick-player', { playerId });
  };

  const returnToLobby = () => {
    socket.emit('return-to-lobby');
  };

  const playCard = (cardId: string, side?: BoardSide) => {
    socket.emit('play-card', { cardId, side });
  };

  const passTurn = () => {
    socket.emit('pass-turn');
  };

  const sendChatMessage = (message: string) => {
    socket.emit('chat-message', { message });
  };

  const setTyping = (isTyping: boolean) => {
    socket.emit(isTyping ? 'typing-start' : 'typing-stop');
  };

  return {
    socket,
    isConnected,
    nickname,
    roomState,
    gameState,
    myPlayerId,
    myPlayer,
    currentPlayer,
    isMyTurn,
    isHost,
    everyoneReady,
    joinedRoom,
    error,
    infoMessage,
    lastResetAt,
    messages,
    typingPlayers,
    playableCards,
    rooms,
    lookupResult,
    isRoomsLoading,
    isSubmitting,
    createRoom,
    joinRoom,
    lookupRoom,
    refreshRooms,
    leaveRoom,
    setReady,
    startGame,
    kickPlayer,
    returnToLobby,
    playCard,
    passTurn,
    sendChatMessage,
    setTyping,
  };
}
