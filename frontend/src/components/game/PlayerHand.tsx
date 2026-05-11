import type { DominoCard as DominoCardType } from '@/types/game';
import { DominoCard } from './DominoCard';

interface PlayerHandProps {
  cards: DominoCardType[];
  selectedCardId: string | null;
  playableCardIds: Set<string>;
  onSelectCard: (cardId: string) => void;
  canInteract: boolean;
}

export function PlayerHand({
  cards,
  selectedCardId,
  playableCardIds,
  onSelectCard,
  canInteract,
}: PlayerHandProps) {
  return (
    <div className="w-full flex gap-2 overflow-x-auto pb-4 pt-2 px-2 scroll-smooth scrollbar-hide player-hand-container">
      {cards.length === 0 ? (
        <p className="py-4 font-mono text-sm font-bold uppercase text-nb-primary">
          All tiles played!
        </p>
      ) : (
        cards.map((card) => (
          <DominoCard
            key={card.id}
            card={card}
            onClick={() => onSelectCard(card.id)}
            canPlay={playableCardIds.has(card.id) && canInteract}
            selected={selectedCardId === card.id}
            disabled={!canInteract}
          />
        ))
      )}
    </div>
  );
}
