'use client';

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { ArrowRight, MessageSquare, Trophy, Zap, Gamepad2, Shield, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';

export default function LandingPage() {
  const { setSetupDialog } = useGameStore();

  const features = [
    {
      title: 'Real-time & No Lag',
      description: 'Mabar gaple tanpa delay, teknologi WebSocket kita gacor parah.',
      icon: <Zap className="h-6 w-6 text-brand-light" />,
    },
    {
      title: 'Aturan Original',
      description: 'Aturan asli domino Nusantara, gak pake ribet, validasi otomatis.',
      icon: <Gamepad2 className="h-6 w-6 text-accent" />,
    },
    {
      title: 'Chattingan Seru',
      description: 'Bisa ceng-cengan bareng pemain lain pake fitur bubble chat di meja.',
      icon: <MessageSquare className="h-6 w-6 text-purple-400" />,
    },
    {
      title: 'Leaderboard GG',
      description: 'Skor auto-track, ketauan deh siapa yang paling cupu atau sepuh.',
      icon: <Trophy className="h-6 w-6 text-gold" />,
    },
  ];

  const steps = [
    {
      title: 'Bikin Meja atau Join',
      description: 'Klik Bikin Meja buat mabar bareng sirkel, atau Ikut Mabar pake kode dari temen lu.',
    },
    {
      title: 'Nunggu Room Full',
      description: 'Stay aja di meja, nunggu sampe 4 orang kumpul biar bisa gaspol.',
    },
    {
      title: 'Gaskeun Main!',
      description: 'Dapet 7 kartu masing-masing. Kalo punya balak 6, lu yang jalan duluan.',
    },
    {
      title: 'Sambung Kartunya',
      description: 'Samain angka di kartu lu sama yang di meja. Kalo zonk, ya terpaksa Pass.',
    },
    {
      title: 'Bantai Musuh lu',
      description: 'Abisin kartu lu paling cepet, atau sisa poin dikit pas mentok buat menang.',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#050a0f]">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-32 text-center md:py-48">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,83,182,0.15),_transparent_60%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand-light shadow-[0_0_15px_rgba(6,83,182,0.3)]">
            <Shield className="mr-2 h-4 w-4" />
            Season 1 Udah Live, Cuy!
          </div>
          <h1 className="font-[var(--font-display)] text-6xl font-bold leading-tight tracking-tight text-white md:text-8xl">
            GAPLE <br className="md:hidden" />
            <span className="bg-gradient-to-r from-brand-light to-white bg-clip-text text-transparent">
              ARENA
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-300 md:text-xl font-medium">
            Main gaple tradisional bareng sirkel lu secara online. Rasain pengalaman mabar yang asik, kenceng, dan gak ngebosenin!
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group relative overflow-hidden rounded-full bg-brand px-8 text-lg font-bold text-white shadow-[0_0_30px_rgba(6,83,182,0.4)] transition-all hover:scale-105 hover:bg-brand-light border-none"
              onClick={() => setSetupDialog(true, 'create')}
            >
              <span className="relative z-10 flex items-center gap-2">
                Bikin Meja <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-brand/30 bg-white/5 px-8 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-brand-light hover:text-brand-light"
              onClick={() => setSetupDialog(true, 'join')}
            >
              Ikut Mabar
            </Button>
          </div>
        </motion.div>

        {/* Floating Cards Background Decoration */}
        <div className="absolute left-10 top-20 hidden md:block">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [10, 15, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-32 w-16 rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
          />
        </div>
        <div className="absolute right-20 top-40 hidden md:block">
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [-10, -5, -10] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="h-32 w-16 rounded-xl border border-white/10 bg-brand/10 shadow-2xl backdrop-blur-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-white md:text-5xl">
            Kenapa Harus Mabar Di Sini?
          </h2>
          <p className="mt-4 text-slate-400 font-medium">Fitur-fitur gokil yang bikin mabar lu makin pecah.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-brand/40 hover:bg-white/[0.04]"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 transition-all group-hover:scale-110 group-hover:bg-brand/10 group-hover:ring-brand/30">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400 font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to Play Section */}
      <section id="how-to-play" className="w-full max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-white md:text-5xl">
            Tutorial Biar Jago
          </h2>
          <p className="mt-4 text-slate-400 font-medium">Gampang kok, yang penting lu gak cupu.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-lg font-bold text-brand-light ring-1 ring-brand/30">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-slate-400 font-medium">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-purple-500/10 blur-3xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#050a0f] p-8 shadow-2xl"
            >
              <div className="flex h-full flex-col items-center justify-center space-y-6 rounded-2xl border border-dashed border-slate-700 bg-slate-800/30">
                <PlayCircle className="h-20 w-20 text-brand-light opacity-50" />
                <p className="text-slate-500 font-bold tracking-widest uppercase">Gaskeun!</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/20 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6">
               <NextImage 
                src="/image/logo/gglogo.svg" 
                alt="Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="font-[var(--font-display)] font-bold text-white">GAPLE ARENA</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Gaple Arena. Main asik bareng sirkel!
          </p>
        </div>
      </footer>
    </main>
  );
}
