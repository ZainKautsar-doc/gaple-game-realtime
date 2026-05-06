import type {
  BoardSide,
  ChatMessage,
  GameStateView,
  RoomState,
  TypingPlayer,
} from './game';

export interface ServerToClientEvents {
  'joined-room': (payload: { playerId: string; roomId: string }) => void;
  'join-failed': (payload: { message: string }) => void;
  'room-state': (roomState: RoomState) => void;
  'game-started': (payload: { roomId: string; startedAt: number }) => void;
  'game-state': (gameState: GameStateView) => void;
  'action-error': (payload: { message: string }) => void;
  'chat-history': (messages: ChatMessage[]) => void;
  'chat-message': (message: ChatMessage) => void;
  'typing-state': (players: TypingPlayer[]) => void;
}

export interface ClientToServerEvents {
  'join-room': (payload: { nickname: string }) => void;
  'leave-room': () => void;
  'play-card': (payload: { cardId: string; side?: BoardSide }) => void;
  'pass-turn': () => void;
  'chat-message': (payload: { message: string }) => void;
  'typing-start': () => void;
  'typing-stop': () => void;
}

