import type {
  DominoCard,
  GameState,
  PlacementOption,
  ScoreEntry,
} from '../types/game';

export class GameLogic {
  static getPlacementOptions(
    card: DominoCard,
    gameState: GameState
  ): PlacementOption[] {
    if (
      gameState.board.length === 0 ||
      gameState.leftEnd === null ||
      gameState.rightEnd === null
    ) {
      return [{ side: 'right', flipped: false }];
    }

    const options: PlacementOption[] = [];
    const seen = new Set<string>();

    const pushOption = (side: PlacementOption['side'], flipped: boolean) => {
      const key = `${side}:${flipped}`;
      if (!seen.has(key)) {
        seen.add(key);
        options.push({ side, flipped });
      }
    };

    if (card.right === gameState.leftEnd) {
      pushOption('left', false);
    }
    if (card.left === gameState.leftEnd) {
      pushOption('left', true);
    }
    if (card.left === gameState.rightEnd) {
      pushOption('right', false);
    }
    if (card.right === gameState.rightEnd) {
      pushOption('right', true);
    }

    return options;
  }

  static hasPlayableCard(cards: DominoCard[], gameState: GameState): boolean {
    return cards.some(
      (card) => this.getPlacementOptions(card, gameState).length > 0
    );
  }

  static playCard(
    card: DominoCard,
    placement: PlacementOption,
    gameState: GameState
  ): DominoCard {
    const playedCard = placement.flipped
      ? { ...card, left: card.right, right: card.left }
      : card;

    if (
      gameState.board.length === 0 ||
      gameState.leftEnd === null ||
      gameState.rightEnd === null
    ) {
      gameState.board = [playedCard];
      gameState.leftEnd = playedCard.left;
      gameState.rightEnd = playedCard.right;
      return playedCard;
    }

    if (placement.side === 'left') {
      gameState.board.unshift(playedCard);
      gameState.leftEnd = playedCard.left;
    } else {
      gameState.board.push(playedCard);
      gameState.rightEnd = playedCard.right;
    }

    return playedCard;
  }

  static getCardScore(card: DominoCard): number {
    return card.left + card.right;
  }

  static calculateScores(gameState: GameState): ScoreEntry[] {
    const scores = gameState.players.map((player) => ({
      playerId: player.id,
      nickname: player.nickname,
      position: player.position,
      score: player.hand.reduce(
        (total, card) => total + this.getCardScore(card),
        0
      ),
      rank: 0,
      remainingCards: [...player.hand],
    }));

    scores.sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      if (left.remainingCards.length !== right.remainingCards.length) {
        return left.remainingCards.length - right.remainingCards.length;
      }

      return left.nickname.localeCompare(right.nickname);
    });

    return scores.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }
}
