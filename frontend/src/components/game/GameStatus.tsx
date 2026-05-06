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
    <Card className="section-shell">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Table Status</CardTitle>
            <p className="mt-2 text-sm text-slate-300">
              Server memvalidasi semua langkah, jadi state meja selalu sinkron.
            </p>
          </div>
          <Badge className="border-aqua/30 bg-aqua/10 text-aqua">
            {gameState.roomId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className="border-white/10 bg-white/10 text-slate-100">
            Board {gameState.board.length} kartu
          </Badge>
          <Badge className="border-gold/30 bg-gold/10 text-gold">
            Tanganmu {myPlayer?.hand.length ?? 0}
          </Badge>
          {gameState.leftEnd !== null && gameState.rightEnd !== null && (
            <Badge className="border-mint/30 bg-mint/10 text-mint">
              Ujung {gameState.leftEnd} - {gameState.rightEnd}
            </Badge>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-mint" />
            <div>
              <p className="text-sm text-slate-400">Sekarang bermain</p>
              <p className="font-semibold text-white">
                {currentPlayer?.nickname ?? 'Menunggu giliran'}{' '}
                {isMyTurn ? '(kamu)' : ''}
              </p>
            </div>
          </div>
        </div>
        {winner && (
          <div className="rounded-2xl border border-gold/25 bg-gold/10 p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-gold" />
              <p className="font-semibold text-white">
                {winner.nickname} memenangkan ronde ini.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

