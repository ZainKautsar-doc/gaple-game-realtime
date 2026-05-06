import type {
  BoardSide,
  ChatMessage,
  GameStateView,
  RoomLookupResult,
  RoomState,
  RoomSummary,
  TypingPlayer,
} from './game';

export interface ServerToClientEvents {
  'joined-room': (payload: { playerId: string; roomId: string }) => void;
  'join-failed': (payload: { message: string }) => void;
  'room-lookup-result': (payload: RoomLookupResult) => void;
  'rooms-list': (rooms: RoomSummary[]) => void;
  'room-state': (roomState: RoomState) => void;
  'game-reset': () => void;
  'player-kicked': (payload: { playerName: string; reason: string }) => void;
  'game-started': (payload: { roomId: string; startedAt: number }) => void;
  'game-state': (gameState: GameStateView) => void;
  'action-error': (payload: { message: string }) => void;
  'chat-history': (messages: ChatMessage[]) => void;
  'chat-message': (message: ChatMessage) => void;
  'typing-state': (players: TypingPlayer[]) => void;
}

export interface ClientToServerEvents {
  'create-room': (payload: {
    playerName: string;
    roomName?: string;
    type: 'public' | 'private';
    password?: string;
    maxPlayers: 2 | 3 | 4;
  }) => void;
  'join-room': (payload: {
    roomCode: string;
    playerName: string;
    password?: string;
  }) => void;
  'lookup-room': (payload: { roomCode: string }) => void;
  'get-rooms': () => void;
  'leave-room': () => void;
  'set-ready': (payload: { isReady: boolean }) => void;
  'start-game': () => void;
  'kick-player': (payload: { playerId: string }) => void;
  'return-to-lobby': () => void;
  'play-card': (payload: { cardId: string; side?: BoardSide }) => void;
  'pass-turn': () => void;
  'chat-message': (payload: { message: string }) => void;
  'typing-start': () => void;
  'typing-stop': () => void;
}
