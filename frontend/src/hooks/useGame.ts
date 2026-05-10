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
    if (isConnected) {
      socket.emit('get-rooms');
      // Re-join logic for persistence/refresh
      const { isInRoom, currentRoomId, currentRoomCode, playerName } = useNavigationStore.getState();
      if (isInRoom && (currentRoomId || currentRoomCode)) {
        socket.emit('rejoin-room', {
          roomId: currentRoomId ?? undefined,
          roomCode: currentRoomCode ?? undefined,
          playerName: playerName ?? undefined
        });
      }
    }
  }, [isConnected, setIsConnected, socket]);

  useEffect(() => {
    const handleJoinedRoom = ({ playerId, roomId }: { playerId: string; roomId: string }) => {
      setMyPlayerId(playerId);
      setJoinedRoom(true);
      setError(null);
      setInfoMessage(null);
      clearGameReset();
      setSubmitting(false);

      // Set navigation state
      const roomCode = useGameStore.getState().roomState?.code || '';
      useNavigationStore.getState().setRoomInfo(roomId, roomCode, nickname);
    };

    const handleJoinFailed = ({ message }: { message: string }) => {
      setJoinedRoom(false);
      setError(message);
      setSubmitting(false);
      // Clear navigation state if room not found
      if (message === 'Room tidak ditemukan.') {
        useNavigationStore.getState().clearRoomInfo();
      }
    };

    const handleLookupResult = (payload: RoomLookupResult) => {
      setLookupResult(payload);
      setSubmitting(false);
      if (!payload.found && payload.message) {
        setError(payload.message);
      }
    };

    const handleRoomsList = (nextRooms: RoomSummary[]) => {
      setRooms(nextRooms);
    };

    const handleRoomState = (nextRoomState: RoomState) => {
      if (nextRoomState.status === 'playing') {
        clearGameReset();
      }
      setRoomState(nextRoomState);

      // Ensure navigation store is in sync
      const { currentRoomId, setRoomInfo } = useNavigationStore.getState();
      if (nextRoomState.code && currentRoomId) {
        setRoomInfo(currentRoomId, nextRoomState.code, nickname);
      }
    };

    const handleGameState = (nextGameState: GameStateView) => {
      setGameState(nextGameState);
    };

    const handleGameReset = () => {
      markGameReset();
    };

    const handlePlayerKicked = ({ reason }: { playerName: string; reason: string }) => {
      setError(reason);
      setJoinedRoom(false);
      setRoomState(null);
      markGameReset();
      clearChat();
      useNavigationStore.getState().clearRoomInfo();
    };

    const handleActionError = ({ message }: { message: string }) => {
      setError(message);
      setSubmitting(false);
    };

    const handleChatHistory = (nextMessages: ChatMessage[]) => {
      setMessages(nextMessages);
    };

    const handleChatMessage = (message: ChatMessage) => {
      addMessage(message);
    };

    const handleTypingState = (players: TypingPlayer[]) => {
      setTypingPlayers(players);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleRoomDeleted = () => {
      setError('Room telah dibubarkan oleh host.');
      setJoinedRoom(false);
      setRoomState(null);
      useNavigationStore.getState().clearRoomInfo();
      router.push('/');
    };

    socket.on('joined-room', handleJoinedRoom);
    socket.on('join-failed', handleJoinFailed);
    socket.on('room-lookup-result', handleLookupResult);
    socket.on('rooms-list', handleRoomsList);
    socket.on('room-state', handleRoomState);
    socket.on('game-state', handleGameState);
    socket.on('game-reset', handleGameReset);
    socket.on('player-kicked', handlePlayerKicked);
    socket.on('action-error', handleActionError);
    socket.on('chat-history', handleChatHistory);
    socket.on('chat-message', handleChatMessage);
    socket.on('typing-state', handleTypingState);
    socket.on('room-deleted', handleRoomDeleted);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('joined-room', handleJoinedRoom);
      socket.off('join-failed', handleJoinFailed);
      socket.off('room-lookup-result', handleLookupResult);
      socket.off('rooms-list', handleRoomsList);
      socket.off('room-state', handleRoomState);
      socket.off('game-state', handleGameState);
      socket.off('game-reset', handleGameReset);
      socket.off('player-kicked', handlePlayerKicked);
      socket.off('action-error', handleActionError);
      socket.off('chat-history', handleChatHistory);
      socket.off('chat-message', handleChatMessage);
      socket.off('typing-state', handleTypingState);
      socket.off('room-deleted', handleRoomDeleted);
      socket.off('disconnect', handleDisconnect);
    };
  }, [
    addMessage,
    clearChat,
    clearGameReset,
    markGameReset,
    setError,
    setGameState,
    setInfoMessage,
    setIsConnected,
    setJoinedRoom,
    setLookupResult,
    setMessages,
    setMyPlayerId,
    setRoomState,
    setRooms,
    setSubmitting,
    setTypingPlayers,
    socket,
  ]);

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
