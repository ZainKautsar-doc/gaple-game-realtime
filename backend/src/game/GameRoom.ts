import { randomUUID } from 'crypto';
import { DeckManager } from './DeckManager';
import { GameLogic } from './GameLogic';
import type {
  BoardSide,
  ChatMessage,
  GameState,
  GameStateView,
  Player,
  PublicPlayer,
  RoomState,
} from '../types/game';
import type { PlayerIdentity, TypingPlayer } from '../types/player';

const MAX_PLAYERS = 4;

type MutationResult =
  | { success: true }
  | { success: false; error: string };

export class GameRoom {
  private gameState: GameState;

  private chatMessages: ChatMessage[] = [];

  private typingPlayers = new Map<string, string>();

  constructor(private readonly roomId: string) {
    this.gameState = {
      roomId,
      players: [],
      board: [],
      currentTurnIndex: 0,
      status: 'waiting',
      winner: null,
      leftEnd: null,
      rightEnd: null,
      countdownEndsAt: null,
      startedAt: null,
    };
  }

  addPlayer(player: PlayerIdentity): MutationResult {
    const existingPlayer = this.gameState.players.find(
      (roomPlayer) => roomPlayer.id === player.id
    );

    if (existingPlayer) {
      existingPlayer.nickname = player.nickname;
      existingPlayer.socketId = player.socketId;
      existingPlayer.connected = true;
      return { success: true };
    }

    if (this.gameState.players.length >= MAX_PLAYERS) {
      return { success: false, error: 'Room is full.' };
    }

    this.gameState.players.push({
      ...player,
      hand: [],
      hasPassed: false,
      connected: true,
    });

    return { success: true };
  }

  removePlayer(playerId: string): void {
    const removedIndex = this.gameState.players.findIndex(
      (player) => player.id === playerId
    );

    if (removedIndex === -1) {
      return;
    }

    this.gameState.players.splice(removedIndex, 1);
    this.typingPlayers.delete(playerId);

    if (this.gameState.players.length === 0) {
      this.resetToWaiting();
      return;
    }

    if (removedIndex < this.gameState.currentTurnIndex) {
      this.gameState.currentTurnIndex -= 1;
    }

    if (this.gameState.currentTurnIndex >= this.gameState.players.length) {
      this.gameState.currentTurnIndex = 0;
    }

    if (this.gameState.status !== 'waiting') {
      this.resetToWaiting();
    }
  }

  isEmpty(): boolean {
    return this.gameState.players.length === 0;
  }

  shouldStartCountdown(): boolean {
    return (
      this.gameState.players.length === MAX_PLAYERS &&
      this.gameState.status === 'waiting' &&
      this.gameState.countdownEndsAt === null
    );
  }

  setCountdown(endAt: number): void {
    this.gameState.status = 'countdown';
    this.gameState.countdownEndsAt = endAt;
  }

  clearCountdown(): void {
    if (this.gameState.status === 'countdown') {
      this.gameState.status = 'waiting';
    }
    this.gameState.countdownEndsAt = null;
  }

  startGame(): void {
    if (this.gameState.players.length !== MAX_PLAYERS) {
      throw new Error('Game needs exactly 4 players.');
    }

    const deck = DeckManager.createDeck();
    const hands = DeckManager.dealCards(deck, MAX_PLAYERS);

    this.gameState.players.forEach((player, index) => {
      player.hand = hands[index];
      player.hasPassed = false;
      player.connected = true;
    });

    this.gameState.board = [];
    this.gameState.currentTurnIndex = Math.floor(
      Math.random() * this.gameState.players.length
    );
    this.gameState.status = 'playing';
    this.gameState.winner = null;
    this.gameState.leftEnd = null;
    this.gameState.rightEnd = null;
    this.gameState.countdownEndsAt = null;
    this.gameState.startedAt = Date.now();
    this.typingPlayers.clear();
  }

  playCard(playerId: string, cardId: string, side?: BoardSide): MutationResult {
    if (this.gameState.status !== 'playing') {
      return { success: false, error: 'Game belum dimulai.' };
    }

    const currentPlayer = this.gameState.players[this.gameState.currentTurnIndex];
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { success: false, error: 'Bukan giliran kamu.' };
    }

    const card = currentPlayer.hand.find((handCard) => handCard.id === cardId);
    if (!card) {
      return { success: false, error: 'Kartu tidak ditemukan di tanganmu.' };
    }

    const placementOptions = GameLogic.getPlacementOptions(card, this.gameState);
    if (placementOptions.length === 0) {
      return { success: false, error: 'Kartu itu tidak bisa dimainkan.' };
    }

    const distinctSides = Array.from(
      new Set(placementOptions.map((option) => option.side))
    );
    if (distinctSides.length > 1 && !side) {
      return {
        success: false,
        error: 'Pilih sisi kiri atau kanan untuk meletakkan kartu.',
      };
    }

    const selectedPlacement =
      placementOptions.find((option) => option.side === side) ??
      placementOptions[0];

    GameLogic.playCard(card, selectedPlacement, this.gameState);
    currentPlayer.hand = currentPlayer.hand.filter(
      (handCard) => handCard.id !== cardId
    );
    this.gameState.players.forEach((player) => {
      player.hasPassed = false;
    });
    this.typingPlayers.delete(playerId);

    const winner = GameLogic.checkWinner(this.gameState);
    if (winner) {
      this.gameState.winner = winner;
      this.gameState.status = 'finished';
    } else {
      this.nextTurn();
    }

    return { success: true };
  }

  passTurn(playerId: string): MutationResult {
    if (this.gameState.status !== 'playing') {
      return { success: false, error: 'Game belum dimulai.' };
    }

    const currentPlayer = this.gameState.players[this.gameState.currentTurnIndex];
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { success: false, error: 'Bukan giliran kamu.' };
    }

    if (GameLogic.hasPlayableCard(currentPlayer.hand, this.gameState)) {
      return {
        success: false,
        error: 'Kamu masih punya kartu yang bisa dimainkan.',
      };
    }

    currentPlayer.hasPassed = true;
    this.typingPlayers.delete(playerId);

    const winner = GameLogic.checkWinner(this.gameState);
    if (winner) {
      this.gameState.winner = winner;
      this.gameState.status = 'finished';
    } else {
      this.nextTurn();
    }

    return { success: true };
  }

  addChatMessage(playerId: string, message: string): ChatMessage | null {
    const player = this.gameState.players.find(
      (roomPlayer) => roomPlayer.id === playerId
    );
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
    const player = this.gameState.players.find(
      (roomPlayer) => roomPlayer.id === playerId
    );
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

  getGameState(): GameState {
    return this.gameState;
  }

  getRoomState(): RoomState {
    return {
      roomId: this.roomId,
      status: this.gameState.status,
      players: this.toPublicPlayers(this.gameState.players),
      maxPlayers: MAX_PLAYERS,
      countdownEndsAt: this.gameState.countdownEndsAt,
      message: this.getStatusMessage(),
    };
  }

  getPlayerView(playerId: string): GameStateView {
    return {
      ...this.gameState,
      selfId: playerId,
      players: this.toPublicPlayers(this.gameState.players).map((player) => ({
        ...player,
        hand:
          player.id === playerId
            ? this.gameState.players.find(
                (roomPlayer) => roomPlayer.id === playerId
              )?.hand ?? []
            : [],
      })),
    };
  }

  findPlayer(playerId: string): Player | undefined {
    return this.gameState.players.find((player) => player.id === playerId);
  }

  private nextTurn(): void {
    this.gameState.currentTurnIndex =
      (this.gameState.currentTurnIndex + 1) % this.gameState.players.length;
  }

  private resetToWaiting(): void {
    this.gameState.board = [];
    this.gameState.currentTurnIndex = 0;
    this.gameState.status = 'waiting';
    this.gameState.winner = null;
    this.gameState.leftEnd = null;
    this.gameState.rightEnd = null;
    this.gameState.countdownEndsAt = null;
    this.gameState.startedAt = null;
    this.typingPlayers.clear();

    this.gameState.players.forEach((player) => {
      player.hand = [];
      player.hasPassed = false;
      player.connected = true;
    });
  }

  private toPublicPlayers(players: Player[]): PublicPlayer[] {
    return players.map((player) => ({
      id: player.id,
      nickname: player.nickname,
      cardCount: player.hand.length,
      hasPassed: player.hasPassed,
      isConnected: player.connected,
    }));
  }

  private getStatusMessage(): string {
    if (this.gameState.status === 'countdown') {
      return 'Semua kursi terisi. Game akan mulai sebentar lagi.';
    }

    if (this.gameState.status === 'playing') {
      return 'Match sedang berjalan. Server menjadi sumber kebenaran utama.';
    }

    if (this.gameState.status === 'finished') {
      const winner = this.findPlayer(this.gameState.winner ?? '');
      return winner
        ? `${winner.nickname} memenangkan ronde ini.`
        : 'Ronde selesai.';
    }

    const missingPlayers = MAX_PLAYERS - this.gameState.players.length;
    return missingPlayers > 0
      ? `Menunggu ${missingPlayers} pemain lagi untuk memulai.`
      : 'Siap memulai ronde baru.';
  }
}

