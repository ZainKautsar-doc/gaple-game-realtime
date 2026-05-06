'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Radio, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';

export default function LandingPage() {
  const router = useRouter();
  const { nickname, setNickname, joinedRoom } = useGameStore();
  const [formError, setFormError] = useState<string | null>(null);

  const handleJoin = () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2) {
      setFormError('Nickname minimal 2 karakter.');
      return;
    }

    setFormError(null);
    setNickname(trimmedNickname);
    router.push('/lobby');
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12">
      <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <div className="mb-6 inline-flex items-center rounded-full border border-mint/20 bg-mint/10 px-4 py-2 text-sm font-semibold text-mint">
            <Radio className="mr-2 h-4 w-4" />
            Realtime 4 pemain, 1 meja, tanpa refresh
          </div>
          <h1 className="max-w-3xl font-[var(--font-display)] text-5xl font-bold leading-none text-white md:text-7xl">
            Gaple Realtime Arena
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-slate-300">
            Mainkan gaple multiplayer dengan tempo cepat, board yang hidup, dan
            chat realtime langsung dari browser.
          </p>

          <div className="mt-10 grid gap-4 md:max-w-xl">
            <Card className="section-shell">
              <CardHeader className="pb-3">
                <CardTitle>{joinedRoom ? 'Lanjut ke meja' : 'Masuk ke lobby'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="Masukkan nickname kamu"
                  maxLength={18}
                />
                {formError && (
                  <p className="text-sm text-rose-300">{formError}</p>
                )}
                <Button className="w-full" size="lg" onClick={handleJoin}>
                  {joinedRoom ? 'Kembali ke Lobby' : 'Join Game'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-panel p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Players
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">4 seat</p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Transport
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">Socket.IO</p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Match
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">Realtime</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="glass-panel relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,214,107,0.18),_transparent_30%)]" />
            <div className="relative space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                    Arena Preview
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Neon table, live turn, smooth animations
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  <Users className="mr-2 inline h-4 w-4 text-mint" />
                  4/4 seats
                </div>
              </div>

              <div className="relative flex min-h-[360px] items-center justify-center">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 22, rotate: -10 + index * 3 }}
                    animate={{ opacity: 1, y: [0, -10, 0], rotate: -14 + index * 7 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'mirror',
                    }}
                    className="absolute"
                    style={{
                      left: `${18 + index * 14}%`,
                      top: `${12 + (index % 2) * 12}%`,
                    }}
                  >
                    <div className="h-40 w-20 rounded-[28px] border border-white/15 bg-gradient-to-br from-slate-100 to-slate-300 shadow-2xl" />
                  </motion.div>
                ))}

                <div className="absolute inset-x-10 bottom-8 rounded-[32px] border border-mint/20 bg-gradient-to-br from-mint/10 to-aqua/10 p-6">
                  <p className="text-sm uppercase tracking-[0.22em] text-mint">
                    Table energy
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    Semua aksi kartu, pass, dan chat bergerak instan dari server.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

