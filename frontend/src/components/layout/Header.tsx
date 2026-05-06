'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import { Menu, Sparkles, X, LogOut, User, Plus, DoorOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useGame } from '@/hooks/useGame';
import { RoomSetupDialog } from '@/components/dialog/RoomSetupDialog';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { nickname, setNickname, isSetupDialogOpen, setupDialogMode, setSetupDialog } =
    useGameStore();
  const { leaveRoom, roomState } = useGame();
  const router = useRouter();
  const pathname = usePathname();

  const handleLeave = () => {
    leaveRoom();
    setNickname('');
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How to Play', href: '/#how-to-play' },
    { name: 'Feature', href: '/#features' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 md:px-6">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between rounded-full border border-white/10 bg-[#0c1330]/70 px-4 shadow-[0_18px_50px_rgba(2,6,23,0.35)] backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5 p-2 shadow-[0_0_24px_rgba(0,217,255,0.2)]">
            <NextImage 
              src="/image/logo/gglogo.svg" 
              alt="Logo" 
              fill
              className="object-contain p-2"
            />
          </div>
          <div>
            <span className="font-[var(--font-display)] text-xl font-bold tracking-wider text-white">
              GAPLE ARENA
            </span>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
              Domino Multiplayer Online
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`group relative text-sm font-medium transition-colors hover:text-brand-light ${
                pathname === link.href ? 'text-brand-light' : 'text-slate-300'
              }`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {nickname ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <User className="h-4 w-4 text-brand-light" />
                <span className="text-sm font-medium text-white">{nickname}</span>
                {roomState?.code && (
                  <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 text-[10px] text-brand-light">
                    {roomState.code}
                  </span>
                )}
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLeave}
                className="rounded-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cabut
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full border-brand/50 text-brand-light hover:bg-brand/10"
                onClick={() => setSetupDialog(true, 'join')}
              >
                <DoorOpen className="mr-2 h-4 w-4" />
                Join Room
              </Button>
              <Button
                className="rounded-full font-bold"
                onClick={() => setSetupDialog(true, 'create')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-auto mt-3 max-w-[1400px] rounded-[28px] border border-white/10 bg-[#0c1330]/88 p-4 shadow-[0_18px_50px_rgba(2,6,23,0.35)] backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-brand-light"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full bg-white/10" />
              {nickname ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-brand-light" />
                      <span>{nickname}</span>
                    </div>
                    {roomState?.code && (
                      <span className="text-xs font-mono tracking-[0.24em] text-brand-light">
                        {roomState.code}
                      </span>
                    )}
                  </div>
                  <Button variant="danger" className="w-full" onClick={handleLeave}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cabut Cuy
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setSetupDialog(true, 'join');
                    }}
                  >
                    <DoorOpen className="mr-2 h-4 w-4" />
                    Join Room
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setSetupDialog(true, 'create');
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Room
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <RoomSetupDialog
        isOpen={isSetupDialogOpen}
        onClose={() => setSetupDialog(false)}
        defaultMode={setupDialogMode}
      />
    </header>
  );
}
