'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useRoomStore } from '@/store/roomStore';
import { useChatStore } from '@/store/chatStore';
import { useNavigationStore } from '@/store/navigationStore';
import { useSocket } from './useSocket';
import type {
  ChatMessage,
  GameStateView,
  RoomLookupResult,
  RoomState,
  RoomSummary,
  TypingPlayer,
} from '@/types/game';

export function useGameEvents() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  
  const {
    nickname,
    setIsConnected,
    setMyPlayerId,
    setRoomState,
    setGameState,
    setJoinedRoom,
    setError,
    setInfoMessage,
    markGameReset,
    clearGameReset,
  } = useGameStore();

  const {
    setRooms,
    setLookupResult,
    setSubmitting,
  } = useRoomStore();

  const {
    setMessages,
    addMessage,
    setTypingPlayers,
    clearChat,
  } = useChatStore();

  // Handle connection and re-join logic (Only once!)
  useEffect(() => {
    setIsConnected(isConnected);
    if (isConnected) {
      socket.emit('get-rooms');
      
      const { isInRoom, currentRoomId, currentRoomCode, playerName } = useNavigationStore.getState();
      if (isInRoom && (currentRoomId || currentRoomCode)) {
        socket.emit('rejoin-room', {
          roomId: currentRoomId ?? undefined,
          roomCode: currentRoomCode ?? undefined,
          playerName: playerName ?? undefined,
          avatarId: useGameStore.getState().avatarId
        });
      }
    }
  }, [isConnected, setIsConnected, socket]);

  // Register all socket listeners (Only once!)
  useEffect(() => {
    const handleJoinedRoom = ({ playerId, roomId }: { playerId: string; roomId: string }) => {
      setMyPlayerId(playerId);
      setJoinedRoom(true);
      setError(null);
      setInfoMessage(null);
      clearGameReset();
      setSubmitting(false);

      const roomCode = useGameStore.getState().roomState?.code || '';
      useNavigationStore.getState().setRoomInfo(roomId, roomCode, nickname);
    };

    const handleJoinFailed = ({ message }: { message: string }) => {
      // Don't set error if it's just 'Already in room' during background rejoin
      if (message !== 'Kamu sudah ada di room ini.') {
        setJoinedRoom(false);
        setError(message);
        setSubmitting(false);
        if (message === 'Room tidak ditemukan.') {
          useNavigationStore.getState().clearRoomInfo();
        }
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
    nickname,
    router,
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
}
