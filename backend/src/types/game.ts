import type { PlayerIdentity, PlayerPosition } from './player';

export type BoardSide = 'left' | 'right';
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type EndReason = 'empty-hand' | 'blocked' | 'player-left';

export interface DominoCard {
  id: string;
  left: number;
  right: number;
}

export interface PlacementOption {
  side: BoardSide;
  flipped: boolean;
}

export interface GameMove {
  id: string;
  type: 'play' | 'pass' | 'system';
  playerId: string | null;
  playerName: string;
  text: string;
  card?: DominoCard;
  side?: BoardSide;
  timestamp: number;
}

export interface ScoreEntry {
  playerId: string;
  nickname: string;
  position: PlayerPosition;
  score: number;
  rank: number;
  remainingCards: DominoCard[];
}

export interface GameResult {
  reason: EndReason;
  winnerId: string;
  scores: ScoreEntry[];
  endedAt: number;
  autoReturnAt: number | null;
}

export interface Player extends PlayerIdentity {
  position: PlayerPosition;
  isReady: boolean;
  isHost: boolean;
  hand: DominoCard[];
  hasPassed: boolean;
  connected: boolean;
  score: number;
}

export interface PublicPlayer {
  id: string;
  nickname: string;
  position: PlayerPosition;
  cardCount: number;
  hasPassed: boolean;
  isConnected: boolean;
  isReady: boolean;
  isHost: boolean;
  score: number;
}

export interface PlayerView extends PublicPlayer {
  hand: DominoCard[];
}

export interface GameState {
  roomId: string;
  status: GameStatus;
  players: Player[];
  board: DominoCard[];
  currentTurnIndex: number;
  leftEnd: number | null;
  rightEnd: number | null;
  startedAt: number | null;
  winner: string | null;
  passCount: number;
  lastMove: GameMove | null;
  gameLog: GameMove[];
  result: GameResult | null;
}

export interface GameStateView extends Omit<GameState, 'players'> {
  players: PlayerView[];
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
