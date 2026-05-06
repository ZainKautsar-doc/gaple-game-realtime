export type BoardSide = 'left' | 'right';
export type RoomStatus = 'waiting' | 'countdown' | 'playing' | 'finished';

export interface DominoCard {
  id: string;
  left: number;
  right: number;
}

export interface PlacementOption {
  side: BoardSide;
  flipped: boolean;
}

export interface PublicPlayer {
  id: string;
  nickname: string;
  cardCount: number;
  hasPassed: boolean;
  isConnected: boolean;
}

export interface PlayerView extends PublicPlayer {
  hand: DominoCard[];
}

export interface RoomState {
  roomId: string;
  status: RoomStatus;
  players: PublicPlayer[];
  maxPlayers: number;
  countdownEndsAt: number | null;
  message: string;
}

export interface GameStateView {
  roomId: string;
  players: PlayerView[];
  board: DominoCard[];
  currentTurnIndex: number;
  status: RoomStatus;
  winner: string | null;
  leftEnd: number | null;
  rightEnd: number | null;
  countdownEndsAt: number | null;
  startedAt: number | null;
  selfId: string;
}

export interface ChatMessage {
  id: string;
  kind: 'player' | 'system';
  playerId: string | null;
  nickname: string;
  message: string;
  timestamp: number;
}

export interface TypingPlayer {
  playerId: string;
  nickname: string;
}

