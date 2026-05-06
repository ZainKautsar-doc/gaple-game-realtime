import type { GameStatus } from './game';
import type { PublicPlayer } from './game';

export type RoomType = 'public' | 'private';

export interface RoomState {
  roomId: string;
  name: string;
  code: string;
  type: RoomType;
  status: GameStatus;
  hostId: string | null;
  maxPlayers: 2 | 3 | 4;
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
  maxPlayers: 2 | 3 | 4;
  createdAt: number;
}

export interface RoomLookupResult {
  found: boolean;
  room?: RoomSummary;
  message?: string;
}
