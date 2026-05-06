import type { DominoCard, GameState, PlacementOption } from '../types/game';

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

  static canPlayCard(card: DominoCard, gameState: GameState): boolean {
    return this.getPlacementOptions(card, gameState).length > 0;
  }

  static hasPlayableCard(cards: DominoCard[], gameState: GameState): boolean {
    return cards.some((card) => this.canPlayCard(card, gameState));
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

  static checkWinner(gameState: GameState): string | null {
    const emptyHandPlayer = gameState.players.find(
      (player) => player.hand.length === 0
    );
    if (emptyHandPlayer) {
      return emptyHandPlayer.id;
    }

    const everyonePassed = gameState.players.every((player) => player.hasPassed);
    if (everyonePassed) {
      return this.getPlayerWithLowestPips(gameState);
    }

    return null;
  }

  static getPlayerWithLowestPips(gameState: GameState): string {
    let winnerId = gameState.players[0]?.id ?? '';
    let lowestPips = Number.POSITIVE_INFINITY;

    for (const player of gameState.players) {
      const pips = player.hand.reduce(
        (total, card) => total + card.left + card.right,
        0
      );

      if (pips < lowestPips) {
        lowestPips = pips;
        winnerId = player.id;
      }
    }

    return winnerId;
  }
}

