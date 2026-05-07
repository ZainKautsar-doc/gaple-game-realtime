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
    <div className="flex flex-wrap justify-center gap-3 rounded-xl border border-casino-gold/10 bg-black/30 p-6 shadow-inner">
      {cards.length === 0 ? (
        <p className="py-4 text-sm font-bold text-casino-gold italic">All tiles played!</p>
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
