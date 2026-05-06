import type { PlayerIdentity } from './player';

export type BoardSide = 'left' | 'right';
export type GameStatus = 'waiting' | 'countdown' | 'playing' | 'finished';

export interface DominoCard {
  id: string;
  left: number;
  right: number;
}

export interface Player extends PlayerIdentity {
  hand: DominoCard[];
  hasPassed: boolean;
  connected: boolean;
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

export interface PlacementOption {
  side: BoardSide;
  flipped: boolean;
}

export interface GameState {
  roomId: string;
  players: Player[];
  board: DominoCard[];
  currentTurnIndex: number;
  status: GameStatus;
  winner: string | null;
  leftEnd: number | null;
  rightEnd: number | null;
  countdownEndsAt: number | null;
  startedAt: number | null;
}

export interface GameStateView extends Omit<GameState, 'players'> {
  players: PlayerView[];
  selfId: string;
}

export interface RoomState {
  roomId: string;
  status: GameStatus;
  players: PublicPlayer[];
  maxPlayers: number;
  countdownEndsAt: number | null;
  message: string;
}

export interface ChatMessage {
  id: string;
  kind: 'player' | 'system';
  playerId: string | null;
  nickname: string;
  message: string;
  timestamp: number;
}

