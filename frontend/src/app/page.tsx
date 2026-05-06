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
    title: 'Room Public & Private',
    description: 'Bikin room publik buat open mabar atau room private lengkap password buat sirkel sendiri.',
    icon: Lock,
  },
  {
    title: 'Realtime Multiplayer',
    description: 'Semua aksi jalan lewat socket server-authoritative biar state meja tetap sinkron.',
    icon: Zap,
  },
  {
    title: 'Host Controls',
    description: 'Host bisa atur ready state, mulai game, sampai kick pemain langsung dari lobby.',
    icon: Users,
  },
  {
    title: 'Auto Scoring',
    description: 'Kalau game mentok, sistem otomatis hitung total poin sisa kartu dan tentukan pemenangnya.',
    icon: BadgeCheck,
  },
];

const steps = [
  'Masukkan nama pemain lalu pilih mau buat room atau join room.',
  'Kalau bikin room, tentukan public/private, kapasitas, dan password bila perlu.',
  'Semua pemain masuk ke lobby, ready satu-satu, lalu host mulai pertandingan.',
  'Pasang kartu ke sisi kiri atau kanan. Kalau mentok, gunakan pass.',
  'Game selesai saat ada tangan habis atau semua pemain pass berturut-turut.',
];

export default function LandingPage() {
  const { setSetupDialog } = useGameStore();

  return (
    <main className="relative overflow-hidden">
      <section className="relative mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-6 pb-20 pt-20 md:pt-24">
        <div className="hero-orb left-[-80px] top-10 h-72 w-72 bg-brand/20" />
        <div className="hero-orb right-0 top-20 h-72 w-72 bg-secondary/15" />
        <div className="hero-orb bottom-0 left-1/3 h-72 w-72 bg-accent/10" />

        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm text-brand-light">
              <Sparkles className="h-4 w-4" />
              Redesigned multiplayer domino lobby
            </div>
            <h1 className="mt-6 font-[var(--font-display)] text-5xl font-bold leading-[0.96] text-white md:text-7xl">
              GAPLE GAME
              <span className="mt-2 block bg-gradient-to-r from-brand via-white to-secondary bg-clip-text text-transparent">
                Mabar Online Lebih Niat
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Main domino multiplayer dengan room browser, lobby modern, host control, animasi halus,
              dan sistem skor otomatis saat game mentok.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="rounded-full px-7" onClick={() => setSetupDialog(true, 'create')}>
                Buat Meja
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7"
                onClick={() => setSetupDialog(true, 'join')}
              >
                <DoorOpen className="mr-2 h-5 w-5" />
                Ikut Mabar
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['2K+', 'Player siap mabar'],
                ['Public', 'Browser room instan'],
                ['Smooth', 'Animasi dan flow baru'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <p className="font-[var(--font-display)] text-3xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-400">{label}</p>
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
            <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/10 bg-black/15 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Room Setup</p>
                      <p className="mt-1 text-xl font-semibold text-white">Friday Night Gaple</p>
                    </div>
                    <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand-light">
                      Private
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                      <Users className="mx-auto h-4 w-4 text-brand-light" />
                      <p className="mt-2 text-sm font-medium text-white">4 player</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                      <Layers3 className="mx-auto h-4 w-4 text-secondary" />
                      <p className="mt-2 text-sm font-medium text-white">Lobby ready</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                      <Lock className="mx-auto h-4 w-4 text-accent" />
                      <p className="mt-2 text-sm font-medium text-white">Password</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-brand/20 bg-brand/10 p-5">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="h-5 w-5 text-brand-light" />
                    <p className="text-sm text-slate-100">
                      End-game otomatis menghitung poin terkecil sebagai pemenang dan balik ke lobby.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Turn Indicator</p>
                    <p className="mt-2 text-lg font-semibold text-white">Giliran Budi</p>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Score Preview</p>
                    <p className="mt-2 font-mono text-lg font-semibold text-white">7 - 11 - 16 - 23</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">Feature</p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-bold text-white md:text-5xl">
              Upgrade yang bikin flow main jauh lebih enak
            </h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-[30px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-brand/25 hover:bg-white/[0.07]"
              >
                <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-3">
                  <Icon className="h-5 w-5 text-brand-light" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="how-to-play" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-light">How to Play</p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-bold text-white md:text-5xl">
              Dari bikin room sampai hitung skor
            </h2>
            <p className="mt-5 text-slate-400">
              Flow baru sengaja dibuat lebih jelas: join lebih gampang, lobby lebih informatif, dan hasil akhir lebih transparan.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="flex gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 font-[var(--font-display)] text-lg font-bold text-brand-light">
                  {index + 1}
                </div>
                <p className="pt-1 text-slate-300">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(120deg,rgba(0,217,255,0.16),rgba(255,79,216,0.12))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-[var(--font-display)] text-3xl font-bold text-white">
                Siap bikin meja pertama?
              </h2>
              <p className="mt-2 text-slate-200">
                Mulai dari room public atau private, lalu rasakan flow lobby dan game yang sudah di-upgrade.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-7" onClick={() => setSetupDialog(true, 'create')}>
                Create Room
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 bg-white/10 px-7"
                onClick={() => setSetupDialog(true, 'join')}
              >
                Join Room
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
