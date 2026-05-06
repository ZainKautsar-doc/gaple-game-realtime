import type { DominoCard } from '../types/game';

export class DeckManager {
  static createDeck(): DominoCard[] {
    const deck: DominoCard[] = [];
    let id = 0;

    for (let left = 0; left <= 6; left += 1) {
      for (let right = left; right <= 6; right += 1) {
        deck.push({
          id: `card-${id}`,
          left,
          right,
        });
        id += 1;
      }
    }

    return this.shuffle(deck);
  }

  static shuffle(deck: DominoCard[]): DominoCard[] {
    const shuffled = [...deck];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[index],
      ];
    }

    return shuffled;
  }

  static dealCards(deck: DominoCard[], numPlayers: number): DominoCard[][] {
    const cardsPerPlayer = 7;
    const hands = Array.from({ length: numPlayers }, () => [] as DominoCard[]);

    for (let round = 0; round < cardsPerPlayer; round += 1) {
      for (let playerIndex = 0; playerIndex < numPlayers; playerIndex += 1) {
        const card = deck.pop();
        if (!card) {
          throw new Error('Deck ran out of cards while dealing.');
        }
        hands[playerIndex].push(card);
      }
    }

    return hands;
  }
}

