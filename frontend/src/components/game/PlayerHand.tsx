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
    <Card className="section-shell border-none bg-transparent shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-wrap justify-center gap-3 rounded-[32px] border border-white/5 bg-black/40 p-6 shadow-inner">
          {cards.length === 0 ? (
            <p className="py-4 text-sm font-bold text-slate-500 italic">Kartu lu abis cuy, GG!</p>
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
      </CardContent>
    </Card>
  );
}
