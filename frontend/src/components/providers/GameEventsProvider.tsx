'use client';

import { useGameEvents } from '@/hooks/useGameEvents';

export function GameEventsProvider({ children }: { children: React.ReactNode }) {
  useGameEvents();
  return <>{children}</>;
}
