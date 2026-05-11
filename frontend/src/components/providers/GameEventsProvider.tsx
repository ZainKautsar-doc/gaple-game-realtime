'use client';

import { useEffect } from 'react';
import { useGameEvents } from '@/hooks/useGameEvents';
import { useGameStore } from '@/store/gameStore';

export function GameEventsProvider({ children }: { children: React.ReactNode }) {
  useGameEvents();

  const rehydrateFromStorage = useGameStore((s) => s.rehydrateFromStorage);

  useEffect(() => {
    rehydrateFromStorage();
  }, [rehydrateFromStorage]);

  return <>{children}</>;
}
