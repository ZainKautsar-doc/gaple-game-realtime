import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="section-shell">
      <CardHeader className="pb-4">
        <CardTitle>Tanganmu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-3 rounded-[28px] border border-white/10 bg-black/20 p-5">
          {cards.map((card) => (
            <DominoCard
              key={card.id}
              card={card}
              onClick={() => onSelectCard(card.id)}
              canPlay={playableCardIds.has(card.id) && canInteract}
              selected={selectedCardId === card.id}
              disabled={!canInteract}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

