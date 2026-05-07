'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  DoorOpen,
  Gamepad2,
  Layers3,
  Lock,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';

const features = [
  {
    title: 'Public & Private Tables',
    description: 'Create a public table for anyone to join, or set up a private, password-protected session.',
    icon: Lock,
  },
  {
    title: 'Real-time Multiplayer',
    description: 'Instant synchronization powered by server-authoritative sockets for a seamless experience.',
    icon: Zap,
  },
  {
    title: 'Dealer Controls',
    description: 'Manage players, set readiness states, and control the flow of the game directly from the lobby.',
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
  const { setSetupDialog } = useGameStore();

  return (
    <main className="relative overflow-hidden bg-casino-bg-primary">
      {/* Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,40,32,0.8)_100%)]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-6 pb-20 pt-20 md:pt-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-casino-gold/30 bg-casino-gold/10 px-4 py-2 text-sm text-casino-gold">
              <Sparkles className="h-4 w-4" />
              Welcome to the high-stakes table
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.1] text-casino-text-primary md:text-7xl tracking-tight">
              Experience Classic <br />
              <span className="text-casino-gold">Domino</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-casino-text-secondary">
              Premium multiplayer domino experience. A sophisticated environment featuring seamless real-time play, precise controls, and elegant table interactions.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" size="lg" className="rounded-full px-8" onClick={() => setSetupDialog(true, 'create')}>
                Create Table
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                onClick={() => setSetupDialog(true, 'join')}
              >
                <DoorOpen className="mr-2 h-5 w-5" />
                Join Table
              </Button>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                ['2K+', 'Active Players'],
                ['Global', 'Public Tables'],
                ['Premium', 'Smooth Flow'],
              ].map(([value, label]) => (
                <div key={label} className="casino-card text-center py-6 px-4">
                  <p className="text-3xl font-bold text-casino-gold">{value}</p>
                  <p className="mt-2 text-sm text-casino-text-secondary font-medium tracking-wide uppercase">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="casino-card p-6 border-casino-gold/40 shadow-casino-lg">
              <div className="grid gap-4">
                <div className="rounded-[16px] border border-casino-gold/20 bg-casino-bg-secondary p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-casino-text-muted uppercase tracking-wider">Table Configuration</p>
                      <p className="mt-1 text-xl font-semibold text-casino-text-primary">High Roller Suite</p>
                    </div>
                    <span className="rounded-full border border-casino-gold/30 bg-casino-gold/10 px-3 py-1 text-xs font-semibold text-casino-gold">
                      Private
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-casino-gold/15 bg-casino-bg-surface p-3 text-center transition-colors hover:border-casino-gold/40">
                      <Users className="mx-auto h-5 w-5 text-casino-gold" />
                      <p className="mt-2 text-xs font-semibold text-casino-text-primary">4 Players</p>
                    </div>
                    <div className="rounded-xl border border-casino-gold/15 bg-casino-bg-surface p-3 text-center transition-colors hover:border-casino-gold/40">
                      <Layers3 className="mx-auto h-5 w-5 text-casino-brass" />
                      <p className="mt-2 text-xs font-semibold text-casino-text-primary">Ready</p>
                    </div>
                    <div className="rounded-xl border border-casino-gold/15 bg-casino-bg-surface p-3 text-center transition-colors hover:border-casino-gold/40">
                      <Lock className="mx-auto h-5 w-5 text-casino-gold-light" />
                      <p className="mt-2 text-xs font-semibold text-casino-text-primary">Secured</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[16px] border border-casino-gold/30 bg-[linear-gradient(135deg,rgba(212,175,55,0.1),rgba(184,148,31,0.05))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-4">
                    <Gamepad2 className="h-6 w-6 text-casino-gold" />
                    <p className="text-sm font-medium text-casino-text-primary">
                      Elegant interface, smooth card placements, and clear, decisive turn indicators.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[16px] border border-casino-gold/20 bg-casino-bg-secondary p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-casino-text-muted">Turn Indicator</p>
                    <p className="mt-2 text-lg font-bold text-casino-gold">Player 1&apos;s Turn</p>
                  </div>
                  <div className="rounded-[16px] border border-casino-gold/20 bg-casino-bg-secondary p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-casino-text-muted">Score Standings</p>
                    <p className="mt-2 font-mono text-lg font-semibold text-casino-text-primary">7 - 11 - 16 - 23</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-casino-gold/10">
        <div className="mb-12 flex flex-col gap-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">Premium Features</p>
          <h2 className="text-3xl font-bold text-casino-text-primary md:text-4xl">
            Refined mechanics for serious play
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
               <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="casino-card"
              >
                <div className="mb-5 inline-flex rounded-xl border border-casino-gold/20 bg-casino-bg-secondary p-3">
                  <Icon className="h-6 w-6 text-casino-gold" />
                </div>
                <h3 className="text-xl font-bold text-casino-text-primary">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-casino-text-secondary">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="how-to-play" className="relative z-10 mx-auto max-w-7xl px-6 py-24 border-t border-casino-gold/10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-casino-gold">How to Play</p>
            <h2 className="mt-3 text-3xl font-bold text-casino-text-primary md:text-4xl leading-tight">
              From table selection to victory calculation
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-casino-text-secondary">
              A streamlined flow designed for maximum focus. Clear indications, informative lobbies, and precise resolution.
            </p>
          </div>

          <div className="space-y-5">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="flex gap-5 rounded-2xl border border-casino-gold/15 bg-casino-bg-surface p-5 items-start"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-casino-gold/30 bg-casino-gold/10 text-base font-bold text-casino-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                  {index + 1}
                </div>
                <p className="pt-2 text-sm font-medium leading-relaxed text-casino-text-primary">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-16">
        <div className="casino-card text-center p-12 border-casino-gold/40 shadow-casino-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.05),transparent)] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-casino-text-primary md:text-4xl">
              Ready to take a seat?
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-casino-text-secondary">
              Step into the sophisticated world of classic domino multiplayer. The table is ready.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center w-full">
              <Button variant="primary" size="lg" className="rounded-full px-10" onClick={() => setSetupDialog(true, 'create')}>
                Create Table
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10"
                onClick={() => setSetupDialog(true, 'join')}
              >
                Join Table
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
