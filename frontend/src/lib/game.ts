import type {
  DominoCard,
  GameStateView,
  PlacementOption,
} from '@/types/game';

export function getPlacementOptions(
  card: DominoCard,
  gameState: GameStateView | null
): PlacementOption[] {
  if (!gameState) {
    return [];
  }

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

export function getPlayableMap(
  cards: DominoCard[],
  gameState: GameStateView | null
) {
  const playableMap = new Map<string, PlacementOption[]>();

  for (const card of cards) {
    const options = getPlacementOptions(card, gameState);
    if (options.length > 0) {
      playableMap.set(card.id, options);
    }
  }

  return playableMap;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatCountdown(countdownEndsAt: number | null) {
  if (!countdownEndsAt) {
    return null;
  }

  const remainingMs = Math.max(0, countdownEndsAt - Date.now());
  return (remainingMs / 1000).toFixed(1);
}

export function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}

