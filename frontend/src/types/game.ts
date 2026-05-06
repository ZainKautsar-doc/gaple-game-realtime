export type BoardSide = 'left' | 'right';
export type RoomType = 'public' | 'private';
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type EndReason = 'empty-hand' | 'blocked' | 'player-left';
export type PlayerPosition = 'north' | 'south' | 'east' | 'west';

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

export interface RoomState {
  roomId: string;
  name: string;
  code: string;
  type: RoomType;
  status: GameStatus;
  hostId: string | null;
  maxPlayers: 4;
  players: PublicPlayer[];
  currentPlayers: number;
  createdAt: number;
  message: string;
}

export interface RoomSummary {
  roomId: string;
  name: string;
  code: string;
  type: RoomType;
  status: GameStatus;
  currentPlayers: number;
  maxPlayers: 4;
  createdAt: number;
}

export interface RoomLookupResult {
  found: boolean;
  room?: RoomSummary;
  message?: string;
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

export interface GameStateView {
  roomId: string;
  status: GameStatus;
  players: PlayerView[];
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
