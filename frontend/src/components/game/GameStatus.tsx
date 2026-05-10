import { Trophy, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GameStateView, PlayerView } from '@/types/game';

interface GameStatusProps {
  gameState: GameStateView;
  myPlayer: PlayerView | null;
  currentPlayer: PlayerView | null;
  isMyTurn: boolean;
}

export function GameStatus({
  gameState,
  myPlayer,
  currentPlayer,
  isMyTurn,
}: GameStatusProps) {
  const winner =
    gameState.players.find((player) => player.id === gameState.winner) ?? null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Table Status</CardTitle>
            <p className="mt-2 font-mono text-sm font-medium text-nb-on-surface">
              Server memvalidasi semua langkah, jadi state meja selalu sinkron.
            </p>
          </div>
          <Badge className="border-nb-outline bg-nb-primary text-nb-white">{gameState.roomId}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className="border-nb-outline bg-nb-surface text-nb-on-surface">
            Board {gameState.board.length} kartu
          </Badge>
          <Badge className="border-nb-outline bg-nb-secondary text-nb-on-surface">
            Tanganmu {myPlayer?.hand.length ?? 0}
          </Badge>
          {gameState.leftEnd !== null && gameState.rightEnd !== null && (
            <Badge className="border-nb-outline bg-nb-primary-pure text-nb-white">
              Ujung {gameState.leftEnd} - {gameState.rightEnd}
            </Badge>
          )}
        </div>
        <div className="border-[3px] border-nb-outline bg-nb-surface-low p-4 shadow-nb-sm">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-nb-primary" />
            <div>
              <p className="font-mono text-sm font-bold uppercase text-nb-placeholder">Sekarang bermain</p>
              <p className="font-display text-lg uppercase text-nb-primary">
                {currentPlayer?.nickname ?? 'Menunggu giliran'}{' '}
                {isMyTurn ? '(kamu)' : ''}
              </p>
            </div>
          </div>
        </div>
        {winner && (
          <div className="border-[3px] border-nb-outline bg-nb-secondary p-4 shadow-nb-sm">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-nb-primary" />
              <p className="font-mono text-sm font-bold uppercase text-nb-on-surface">
                {winner.nickname} memenangkan ronde ini.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
