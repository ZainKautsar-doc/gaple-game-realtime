export interface PlayerIdentity {
  id: string;
  socketId: string;
  nickname: string;
}

export type PlayerPosition = 'north' | 'south' | 'east' | 'west';

export interface TypingPlayer {
  playerId: string;
  nickname: string;
}
