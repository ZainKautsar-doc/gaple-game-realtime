'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  DoorOpen,
  Gamepad2,
  Layers3,
  LayoutGrid,
  Loader2,
  Lock,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useNavigationStore } from '@/store/navigationStore';
import { useGame } from '@/hooks/useGame';
import { useEffect } from 'react';

const features = [
  {
    title: 'Public & Private Tables',
    description:
      'Create a public table for anyone to join, or set up a private, password-protected session.',
    icon: Lock,
  },
  {
    title: 'Real-time Multiplayer',
    description:
      'Instant synchronization powered by server-authoritative sockets for a seamless experience.',
    icon: Zap,
  },
  {
    title: 'Dealer Controls',
    description:
      'Manage players, set readiness states, and control the flow of the game directly from the lobby.',
    icon: Users,
  },
  {
    title: 'Automated Scoring',
    description: 'Precise, automatic end-game calculations based on remaining tile values.',
    icon: BadgeCheck,
  },
];

const steps = [
  'Enter your alias and choose to join an active table or host a new one.',
  'If hosting, determine table visibility (public/private) and set a secure password if needed.',
  'Players gather in the pre-game lobby, indicate readiness, and wait for the dealer to commence.',
  'Strategically place your tiles on the board. Use the pass action if you have no valid moves.',
  'Victory goes to the first player to empty their hand or the one with the lowest score in a block.',
];

export default function LandingPage() {
  const router = useRouter();
  const { setSetupDialog, nickname, roomState } = useGameStore();
  const { isInRoom, currentRoomId, currentRoomCode } = useNavigationStore();
  const { joinRoom, isSubmitting, joinedRoom } = useGame();

  const handleBackToRoom = () => {
    if (roomState) {
      if (roomState.status === 'playing') {
        router.push('/game');
      } else {
        router.push('/lobby');
      }
    } else if (isInRoom && currentRoomCode) {
      joinRoom({ roomCode: currentRoomCode, playerName: nickname });
    }
  };

  useEffect(() => {
    if (joinedRoom) {
      if (roomState?.status === 'playing') {
        router.push('/game');
      } else if (roomState?.status === 'waiting') {
        router.push('/lobby');
      }
    }
  }, [joinedRoom, roomState?.status, router]);

  return (
    <main className="relative bg-nb-surface">
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-4 pb-16 pt-16 md:px-6 md:pt-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
          >
            {isInRoom && (
              <div className="mb-8 flex flex-col gap-4 border-[3px] border-nb-outline bg-nb-secondary p-4 shadow-nb-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center border-[3px] border-nb-outline bg-nb-white text-nb-primary">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold uppercase text-nb-on-surface">
                      Active Session
                    </p>
                    <p className="font-mono text-sm font-medium text-nb-on-surface">
                      You are in a room{' '}
                      <span className="font-bold text-nb-primary">({currentRoomCode})</span>
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="primary" onClick={handleBackToRoom}>
                  Go Back
                </Button>
              </div>
            )}

            <div className="inline-flex items-center gap-2 border-[3px] border-nb-outline bg-nb-secondary px-4 py-2 font-mono text-sm font-bold uppercase text-nb-on-surface shadow-nb-sm">
              <Sparkles className="h-4 w-4" />
              Welcome to the table
            </div>
            <h1 className="mt-6 font-display text-5xl uppercase leading-none text-nb-primary md:text-7xl">
              Experience Classic <br />
              <span className="text-nb-primary-pure bg-nb-secondary inline-block px-2 border-[3px] border-nb-outline mt-2">
                Domino
              </span>
            </h1>
            <p className="mt-6 max-w-2xl font-mono text-lg font-medium leading-relaxed text-nb-on-surface">
              Premium multiplayer domino. Real-time play, precise controls, clear turn flow.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {isInRoom ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBackToRoom}
                  disabled={isSubmitting}
                  className="px-10"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <LayoutGrid className="mr-2 h-5 w-5" />
                  )}
                  Back to Room
                </Button>
              ) : (
                <>
                  <Button variant="primary" size="lg" className="px-8" onClick={() => setSetupDialog(true, 'create')}>
                    Create Table
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="px-8" onClick={() => setSetupDialog(true, 'join')}>
                    <DoorOpen className="mr-2 h-5 w-5" />
                    Join Table
                  </Button>
                </>
              )}
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                ['2K+', 'Active Players'],
                ['Global', 'Public Tables'],
                ['Premium', 'Smooth Flow'],
              ].map(([value, label]) => (
                <div key={label} className="nb-card text-center py-8 px-4">
                  <p className="font-display text-3xl uppercase text-nb-primary">{value}</p>
                  <p className="mt-2 font-mono text-sm font-bold uppercase text-nb-on-surface">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
            className="relative"
          >
            <div className="nb-card p-6">
              <div className="grid gap-4">
                <div className="border-[3px] border-nb-outline bg-nb-surface-low p-5 shadow-nb-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-nb-placeholder">
                        Table Configuration
                      </p>
                      <p className="mt-2 font-display text-xl uppercase text-nb-primary">
                        High Roller Suite
                      </p>
                    </div>
                    <span className="border-[3px] border-nb-outline bg-nb-secondary px-3 py-1 font-mono text-xs font-bold uppercase">
                      Private
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="border-[3px] border-nb-outline bg-nb-white py-4 text-center shadow-nb-sm hover:bg-nb-surface-low">
                      <Users className="mx-auto h-5 w-5 text-nb-primary" />
                      <p className="mt-2 font-mono text-xs font-bold uppercase">4 Players</p>
                    </div>
                    <div className="border-[3px] border-nb-outline bg-nb-white py-4 text-center shadow-nb-sm hover:bg-nb-surface-low">
                      <Layers3 className="mx-auto h-5 w-5 text-nb-primary" />
                      <p className="mt-2 font-mono text-xs font-bold uppercase">Ready</p>
                    </div>
                    <div className="border-[3px] border-nb-outline bg-nb-white py-4 text-center shadow-nb-sm hover:bg-nb-surface-low">
                      <Lock className="mx-auto h-5 w-5 text-nb-primary-pure" />
                      <p className="mt-2 font-mono text-xs font-bold uppercase">Secured</p>
                    </div>
                  </div>
                </div>

                <div className="border-[3px] border-nb-outline bg-nb-primary p-5 shadow-nb-sm">
                  <div className="flex items-center gap-4">
                    <Gamepad2 className="h-6 w-6 text-nb-secondary" />
                    <p className="font-mono text-sm font-bold uppercase text-nb-white">
                      Clear interface, sharp placements, decisive turn cues.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border-[3px] border-nb-outline bg-nb-surface-low p-5 shadow-nb-sm">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-nb-placeholder">
                      Turn Indicator
                    </p>
                    <p className="mt-2 font-display text-lg uppercase text-nb-primary">Player 1&apos;s Turn</p>
                  </div>
                  <div className="border-[3px] border-nb-outline bg-nb-surface-low p-5 shadow-nb-sm">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-nb-placeholder">
                      Score Standings
                    </p>
                    <p className="mt-2 font-mono text-lg font-bold text-nb-primary">7 - 11 - 16 - 23</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl border-t-[3px] border-nb-outline px-4 py-20 md:px-6">
        <div className="mb-12 flex flex-col gap-4 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-primary">Premium Features</p>
          <h2 className="font-display text-3xl uppercase text-nb-primary md:text-4xl">
            Refined mechanics for serious play
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="nb-card">
                <div className="mb-5 inline-flex border-[3px] border-nb-outline bg-nb-secondary p-3 shadow-nb-sm">
                  <Icon className="h-6 w-6 text-nb-primary" />
                </div>
                <h3 className="font-display text-xl uppercase text-nb-primary">{feature.title}</h3>
                <p className="mt-3 font-mono text-sm font-medium leading-relaxed text-nb-on-surface">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="how-to-play" className="relative z-10 mx-auto max-w-7xl border-t-[3px] border-nb-outline px-4 py-20 md:px-6">
        <div className="grid gap-12 items-center lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-nb-primary">How to Play</p>
            <h2 className="mt-3 font-display text-3xl uppercase text-nb-primary md:text-4xl leading-tight">
              From table selection to victory calculation
            </h2>
            <p className="mt-5 font-mono text-lg font-medium leading-relaxed text-nb-on-surface">
              A streamlined flow designed for focus: clear indications, informative lobbies, precise resolution.
            </p>
          </div>

          <div className="space-y-5">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-5 border-[3px] border-nb-outline bg-nb-white p-5 shadow-nb-sm items-start"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-nb-outline bg-nb-secondary font-mono text-base font-bold text-nb-on-surface shadow-nb-sm">
                  {index + 1}
                </div>
                <p className="pt-2 font-mono text-sm font-bold leading-relaxed text-nb-on-surface">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-12 md:px-6">
        <div className="nb-card p-12 text-center">
          <h2 className="font-display text-3xl uppercase text-nb-primary md:text-4xl">Ready to take a seat?</h2>
          <p className="mt-4 max-w-2xl mx-auto font-mono text-lg font-medium text-nb-on-surface">
            Classic domino multiplayer. The table is ready.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center w-full">
            {isInRoom ? (
              <Button
                variant="primary"
                size="lg"
                className="px-12"
                onClick={handleBackToRoom}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LayoutGrid className="mr-2 h-5 w-5" />
                )}
                Back to Room
              </Button>
            ) : (
              <>
                <Button variant="primary" size="lg" className="px-10" onClick={() => setSetupDialog(true, 'create')}>
                  Create Table
                </Button>
                <Button size="lg" variant="outline" className="px-10" onClick={() => setSetupDialog(true, 'join')}>
                  Join Table
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
