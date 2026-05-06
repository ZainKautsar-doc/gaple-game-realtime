'use client';

import { useEffect } from 'react';
import { getPlayableMap } from '@/lib/game';
import { useChatStore } from '@/store/chatStore';
import { useGameStore } from '@/store/gameStore';
import type {
  BoardSide,
  ChatMessage,
  GameStateView,
  RoomState,
  TypingPlayer,
} from '@/types/game';
import { useSocket } from './useSocket';

export function useGame() {
  const { socket, isConnected } = useSocket();
  const {
    nickname,
    myPlayerId,
    roomState,
    gameState,
    joinedRoom,
    error,
    setMyPlayerId,
    setRoomState,
    setGameState,
    setIsConnected,
    setJoinedRoom,
    setError,
    resetSession,
  } = useGameStore();
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

  useEffect(() => {
    if (isConnected && nickname && !joinedRoom) {
      socket.emit('join-room', { nickname: nickname.trim() });
    }
  }, [isConnected, joinedRoom, nickname, socket]);

  useEffect(() => {
    const handleJoinedRoom = ({
      playerId,
    }: {
      playerId: string;
      roomId: string;
    }) => {
      setMyPlayerId(playerId);
      setJoinedRoom(true);
      setError(null);
    };

    const handleJoinFailed = ({ message }: { message: string }) => {
      setJoinedRoom(false);
      setError(message);
    };

    const handleRoomState = (nextRoomState: RoomState) => {
      setRoomState(nextRoomState);
    };

    const handleGameState = (nextGameState: GameStateView) => {
      setGameState(nextGameState);
    };

    const handleActionError = ({ message }: { message: string }) => {
      setError(message);
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
      setJoinedRoom(false);
    };

    socket.on('joined-room', handleJoinedRoom);
    socket.on('join-failed', handleJoinFailed);
    socket.on('room-state', handleRoomState);
    socket.on('game-state', handleGameState);
    socket.on('action-error', handleActionError);
    socket.on('chat-history', handleChatHistory);
    socket.on('chat-message', handleChatMessage);
    socket.on('typing-state', handleTypingState);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('joined-room', handleJoinedRoom);
      socket.off('join-failed', handleJoinFailed);
      socket.off('room-state', handleRoomState);
      socket.off('game-state', handleGameState);
      socket.off('action-error', handleActionError);
      socket.off('chat-history', handleChatHistory);
      socket.off('chat-message', handleChatMessage);
      socket.off('typing-state', handleTypingState);
      socket.off('disconnect', handleDisconnect);
    };
  }, [
    addMessage,
    setError,
    setGameState,
    setIsConnected,
    setJoinedRoom,
    setMessages,
    setMyPlayerId,
    setRoomState,
    setTypingPlayers,
    socket,
  ]);

  const myPlayer = gameState?.players.find((player) => player.id === myPlayerId) ?? null;
  const currentPlayer =
    gameState?.players[gameState.currentTurnIndex] ?? null;
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const playableCards = getPlayableMap(myPlayer?.hand ?? [], gameState);

  const joinMainRoom = () => {
    if (!nickname.trim()) {
      setError('Masukkan nickname dulu sebelum join.');
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join-room', { nickname: nickname.trim() });
  };

  const leaveRoom = () => {
    socket.emit('leave-room');
    socket.disconnect();
    resetSession();
    clearChat();
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
    joinedRoom,
    error,
    messages,
    typingPlayers,
    playableCards,
    joinMainRoom,
    leaveRoom,
    playCard,
    passTurn,
    sendChatMessage,
    setTyping,
  };
}
