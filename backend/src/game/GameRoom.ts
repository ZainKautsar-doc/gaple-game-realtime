import { randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { DeckManager } from './DeckManager';
import { GameLogic } from './GameLogic';
import type {
  BoardSide,
  ChatMessage,
  EndReason,
  GameMove,
  GameResult,
  GameState,
  GameStateView,
  Player,
  PublicPlayer,
} from '../types/game';
import type { PlayerIdentity, PlayerPosition, TypingPlayer } from '../types/player';
import type { RoomState, RoomSummary, RoomType } from '../types/room';

const AUTO_RETURN_MS = 8000;

type MutationResult =
  | { success: true; message?: string }
  | { success: false; error: string };

interface CreateRoomOptions {
  id: string;
  name: string;
  code: string;
  type: RoomType;
  password?: string;
  maxPlayers: 4;
  createdAt?: number;
}

const POSITION_POOLS: Record<4, PlayerPosition[]> = {
  4: ['south', 'west', 'north', 'east'],
};

export class GameRoom {
  readonly id: string;

  readonly code: string;

  readonly name: string;

  readonly type: RoomType;

  readonly maxPlayers: 4;

  readonly createdAt: number;

  private readonly passwordHash: Buffer | null;

  private gameState: GameState;

  private chatMessages: ChatMessage[] = [];

  private typingPlayers = new Map<string, string>();

  private autoResetAt: number | null = null;

  constructor(options: CreateRoomOptions) {
    this.id = options.id;
    this.code = options.code;
    this.name = options.name;
    this.type = options.type;
    this.maxPlayers = options.maxPlayers;
    this.createdAt = options.createdAt ?? Date.now();
    this.passwordHash = options.password
      ? this.hashPassword(options.password)
      : null;
    this.gameState = {
      roomId: this.id,
      status: 'waiting',
      players: [],
      board: [],
      currentTurnIndex: 0,
      leftEnd: null,
      rightEnd: null,
      startedAt: null,
      winner: null,
      passCount: 0,
      lastMove: null,
      gameLog: [],
      result: null,
    };
  }

  addPlayer(player: PlayerIdentity, password?: string): MutationResult {
    const validation = this.canJoin(password);
    if (!validation.success) {
      return validation;
    }

    if (this.gameState.players.some((existing) => existing.id === player.id)) {
      return { success: false, error: 'Kamu sudah ada di room ini.' };
    }

    const position = this.getAvailablePosition();
    if (!position) {
      return { success: false, error: 'Posisi kursi tidak tersedia.' };
    }

    this.gameState.players.push({
      ...player,
      position,
      isReady: false,
      isHost: this.gameState.players.length === 0,
      hand: [],
      hasPassed: false,
      connected: true,
      score: 0,
    });

    return { success: true };
  }

  canJoin(password?: string): MutationResult {
    if (this.type === 'private' && !this.passwordMatches(password)) {
      return { success: false, error: 'Password room salah.' };
    }

    if (this.gameState.status === 'playing') {
      return { success: false, error: 'Game sedang berjalan. Tunggu ronde selesai.' };
    }

    if (this.gameState.players.length >= this.maxPlayers) {
      return { success: false, error: 'Room sudah penuh.' };
    }

    return { success: true };
  }

  removePlayer(playerId: string): Player | null {
    const index = this.gameState.players.findIndex((player) => player.id === playerId);
    if (index === -1) {
      return null;
    }

    const [removedPlayer] = this.gameState.players.splice(index, 1);
    this.typingPlayers.delete(playerId);

    if (this.gameState.players.length === 0) {
      this.resetForLobby();
      return removedPlayer;
    }

    if (removedPlayer.isHost) {
      this.gameState.players[0].isHost = true;
    }

    if (this.gameState.status === 'playing') {
      this.finishGame('player-left');
      this.resetForLobby();
    } else if (this.gameState.status === 'finished') {
      this.resetForLobby();
    } else {
      this.gameState.players.forEach((player) => {
        player.isReady = false;
      });
    }

    return removedPlayer;
  }

  isEmpty(): boolean {
    return this.gameState.players.length === 0;
  }

  setReady(playerId: string, isReady: boolean): MutationResult {
    if (this.gameState.status !== 'waiting') {
      return { success: false, error: 'Ready hanya bisa diubah saat di lobby.' };
    }

    const player = this.findPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Pemain tidak ditemukan.' };
    }

    player.isReady = isReady;
    return {
      success: true,
      message: isReady
        ? `${player.nickname} siap bermain.`
        : `${player.nickname} belum siap bermain.`,
    };
  }

  kickPlayer(hostId: string, playerId: string): MutationResult {
    const host = this.findPlayer(hostId);
    if (!host?.isHost) {
      return { success: false, error: 'Hanya host yang bisa mengeluarkan pemain.' };
    }

    if (hostId === playerId) {
      return { success: false, error: 'Host tidak bisa mengeluarkan dirinya sendiri.' };
    }

    const target = this.findPlayer(playerId);
    if (!target) {
      return { success: false, error: 'Pemain target tidak ditemukan.' };
    }

    this.removePlayer(playerId);
    return {
      success: true,
      message: `[HOST] ${target.nickname} telah dikeluarkan dari room.`,
    };
  }

  canStartGame(): boolean {
    return (
      this.gameState.status === 'waiting' &&
      this.gameState.players.length === this.maxPlayers &&
      this.gameState.players.every((player) => player.isReady)
    );
  }

  startGame(hostId: string): MutationResult {
    const host = this.findPlayer(hostId);
    if (!host?.isHost) {
      return { success: false, error: 'Hanya host yang bisa memulai game.' };
    }

    if (!this.canStartGame()) {
      return {
        success: false,
        error: 'Game hanya bisa dimulai jika room sudah penuh dan semua pemain siap.',
      };
    }

    const deck = DeckManager.createDeck();
    const hands = DeckManager.dealCards(deck, this.gameState.players.length);

    this.gameState.players.forEach((player, index) => {
      player.hand = hands[index];
      player.hasPassed = false;
      player.score = 0;
      player.isReady = false;
    });

    this.gameState.status = 'playing';
    this.gameState.board = [];
    this.gameState.currentTurnIndex = Math.floor(
      Math.random() * this.gameState.players.length
    );
    this.gameState.leftEnd = null;
    this.gameState.rightEnd = null;
    this.gameState.startedAt = Date.now();
    this.gameState.winner = null;
    this.gameState.passCount = 0;
    this.gameState.lastMove = null;
    this.gameState.gameLog = [];
    this.gameState.result = null;
    this.autoResetAt = null;
    this.typingPlayers.clear();

    return { success: true };
  }

  playCard(playerId: string, cardId: string, side?: BoardSide): MutationResult {
    if (this.gameState.status !== 'playing') {
      return { success: false, error: 'Game belum dimulai.' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { success: false, error: 'Bukan giliran kamu.' };
    }

    const card = currentPlayer.hand.find((handCard) => handCard.id === cardId);
    if (!card) {
      return { success: false, error: 'Kartu tidak ditemukan di tanganmu.' };
    }

    const placementOptions = GameLogic.getPlacementOptions(card, this.gameState);
    if (placementOptions.length === 0) {
      return { success: false, error: 'Kartu itu tidak bisa dipasang di posisi ini.' };
    }

    const selectedPlacement =
      placementOptions.find((option) => option.side === side) ?? placementOptions[0];

    if (placementOptions.length > 1 && !side) {
      return { success: false, error: 'Pilih mau pasang di sisi kiri atau kanan.' };
    }

    const playedCard = GameLogic.playCard(card, selectedPlacement, this.gameState);
    currentPlayer.hand = currentPlayer.hand.filter((handCard) => handCard.id !== cardId);
    this.gameState.passCount = 0;
    this.gameState.players.forEach((player) => {
      player.hasPassed = false;
    });
    this.typingPlayers.delete(playerId);

    const move = this.createMove({
      type: 'play',
      playerId,
      playerName: currentPlayer.nickname,
      text: `${currentPlayer.nickname} memasang [${playedCard.left}/${playedCard.right}] di ${selectedPlacement.side}.`,
      card: playedCard,
      side: selectedPlacement.side,
    });

    this.gameState.lastMove = move;
    this.gameState.gameLog = [...this.gameState.gameLog.slice(-19), move];

    if (currentPlayer.hand.length === 0) {
      this.finishGame('empty-hand');
      return { success: true };
    }

    this.nextTurn();
    return { success: true };
  }

  passTurn(playerId: string): MutationResult {
    if (this.gameState.status !== 'playing') {
      return { success: false, error: 'Game belum dimulai.' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { success: false, error: 'Bukan giliran kamu.' };
    }

    if (GameLogic.hasPlayableCard(currentPlayer.hand, this.gameState)) {
      return { success: false, error: 'Kamu masih punya kartu yang bisa dimainkan.' };
    }

    currentPlayer.hasPassed = true;
    this.gameState.passCount += 1;
    this.typingPlayers.delete(playerId);

    const move = this.createMove({
      type: 'pass',
      playerId,
      playerName: currentPlayer.nickname,
      text: `${currentPlayer.nickname} pass.`,
    });

    this.gameState.lastMove = move;
    this.gameState.gameLog = [...this.gameState.gameLog.slice(-19), move];

    if (this.gameState.passCount >= this.gameState.players.length) {
      this.finishGame('blocked');
      return { success: true };
    }

    this.nextTurn();
    return { success: true };
  }

  returnToLobby(): void {
    this.resetForLobby();
  }

  addChatMessage(playerId: string, message: string): ChatMessage | null {
    const player = this.findPlayer(playerId);
    if (!player) {
      return null;
    }

    const chatMessage: ChatMessage = {
      id: randomUUID(),
      kind: 'player',
      playerId: player.id,
      nickname: player.nickname,
      message,
      timestamp: Date.now(),
    };

    this.chatMessages = [...this.chatMessages.slice(-59), chatMessage];
    return chatMessage;
  }

  addSystemMessage(message: string): ChatMessage {
    const chatMessage: ChatMessage = {
      id: randomUUID(),
      kind: 'system',
      playerId: null,
      nickname: 'System',
      message,
      timestamp: Date.now(),
    };

    this.chatMessages = [...this.chatMessages.slice(-59), chatMessage];
    return chatMessage;
  }

  getChatMessages(): ChatMessage[] {
    return this.chatMessages;
  }

  setTyping(playerId: string, isTyping: boolean): void {
    const player = this.findPlayer(playerId);
    if (!player) {
      return;
    }

    if (isTyping) {
      this.typingPlayers.set(player.id, player.nickname);
    } else {
      this.typingPlayers.delete(player.id);
    }
  }

  getTypingPlayers(excludePlayerId?: string): TypingPlayer[] {
    return Array.from(this.typingPlayers.entries())
      .filter(([playerId]) => playerId !== excludePlayerId)
      .map(([playerId, nickname]) => ({
        playerId,
        nickname,
      }));
  }

  getRoomState(): RoomState {
    return {
      roomId: this.id,
      name: this.name,
      code: this.code,
      type: this.type,
      status: this.gameState.status,
      hostId: this.gameState.players.find((player) => player.isHost)?.id ?? null,
      maxPlayers: this.maxPlayers,
      players: this.toPublicPlayers(this.gameState.players),
      currentPlayers: this.gameState.players.length,
      createdAt: this.createdAt,
      message: this.getStatusMessage(),
    };
  }

  getRoomSummary(): RoomSummary {
    return {
      roomId: this.id,
      name: this.name,
      code: this.code,
      type: this.type,
      status: this.gameState.status,
      currentPlayers: this.gameState.players.length,
      maxPlayers: this.maxPlayers,
      createdAt: this.createdAt,
    };
  }

  getPlayerView(playerId: string): GameStateView {
    return {
      ...this.gameState,
      result: this.gameState.result
        ? {
            ...this.gameState.result,
            autoReturnAt: this.autoResetAt,
          }
        : null,
      selfId: playerId,
      players: this.toPublicPlayers(this.gameState.players).map((player) => ({
        ...player,
        hand:
          player.id === playerId || this.gameState.status === 'finished'
            ? this.findPlayer(player.id)?.hand ?? []
            : [],
      })),
    };
  }

  getGameState(): GameState {
    return this.gameState;
  }

  findPlayer(playerId: string): Player | undefined {
    return this.gameState.players.find((player) => player.id === playerId);
  }

  getAutoResetAt(): number | null {
    return this.autoResetAt;
  }

  private finishGame(reason: EndReason): GameResult {
    const scores = GameLogic.calculateScores(this.gameState);
    const winner = scores[0];

    this.gameState.players.forEach((player) => {
      const scoreEntry = scores.find((entry) => entry.playerId === player.id);
      player.score = scoreEntry?.score ?? 0;
      player.hasPassed = false;
    });

    this.autoResetAt = Date.now() + AUTO_RETURN_MS;
    this.gameState.status = 'finished';
    this.gameState.winner = winner?.playerId ?? null;
    this.gameState.passCount = 0;
    this.gameState.result = {
      reason,
      winnerId: winner?.playerId ?? '',
      scores,
      endedAt: Date.now(),
      autoReturnAt: this.autoResetAt,
    };

    return this.gameState.result;
  }

  private resetForLobby(): void {
    this.gameState.status = 'waiting';
    this.gameState.board = [];
    this.gameState.currentTurnIndex = 0;
    this.gameState.leftEnd = null;
    this.gameState.rightEnd = null;
    this.gameState.startedAt = null;
    this.gameState.winner = null;
    this.gameState.passCount = 0;
    this.gameState.lastMove = null;
    this.gameState.gameLog = [];
    this.gameState.result = null;
    this.autoResetAt = null;
    this.typingPlayers.clear();

    this.gameState.players.forEach((player) => {
      player.hand = [];
      player.hasPassed = false;
      player.isReady = false;
      player.score = 0;
    });
  }

  private getCurrentPlayer(): Player | undefined {
    return this.gameState.players[this.gameState.currentTurnIndex];
  }

  private nextTurn(): void {
    this.gameState.currentTurnIndex =
      (this.gameState.currentTurnIndex + 1) % this.gameState.players.length;
  }

  private getAvailablePosition(): PlayerPosition | null {
    const occupied = new Set(this.gameState.players.map((player) => player.position));
    const pool = POSITION_POOLS[this.maxPlayers];
    return pool.find((position) => !occupied.has(position)) ?? null;
  }

  private toPublicPlayers(players: Player[]): PublicPlayer[] {
    return players.map((player) => ({
      id: player.id,
      nickname: player.nickname,
      position: player.position,
      cardCount: player.hand.length,
      hasPassed: player.hasPassed,
      isConnected: player.connected,
      isReady: player.isReady,
      isHost: player.isHost,
      score: player.score,
    }));
  }

  private getStatusMessage(): string {
    if (this.gameState.status === 'playing') {
      const currentPlayer = this.getCurrentPlayer();
      return currentPlayer
        ? `Giliran ${currentPlayer.nickname}.`
        : 'Game sedang berjalan.';
    }

    if (this.gameState.status === 'finished' && this.gameState.result) {
      const winner = this.findPlayer(this.gameState.result.winnerId);
      return winner
        ? `${winner.nickname} menang dengan poin ${winner.score}.`
        : 'Permainan berakhir.';
    }

    if (this.gameState.players.length < 2) {
      return 'Menunggu pemain lain bergabung...';
    }

    const readyCount = this.gameState.players.filter((player) => player.isReady).length;
    if (this.gameState.players.length < this.maxPlayers) {
      return `Menunggu ${this.maxPlayers - this.gameState.players.length} pemain lagi. ${readyCount}/${this.gameState.players.length} pemain sudah ready.`;
    }

    return `${readyCount}/${this.maxPlayers} pemain siap. Host bisa mulai saat semua ready.`;
  }

  private createMove(input: Omit<GameMove, 'id' | 'timestamp'>): GameMove {
    return {
      id: randomUUID(),
      timestamp: Date.now(),
      ...input,
    };
  }

  private hashPassword(password: string): Buffer {
    return scryptSync(password, `gaple:${this.code}`, 64);
  }

  private passwordMatches(password?: string): boolean {
    if (!this.passwordHash) {
      return true;
    }

    if (!password) {
      return false;
    }

    const candidate = this.hashPassword(password);
    return timingSafeEqual(this.passwordHash, candidate);
  }
}
