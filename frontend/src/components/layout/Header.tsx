'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Menu, X, LogOut, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useGame } from '@/hooks/useGame';
import { RoomSetupDialog } from '@/components/dialog/RoomSetupDialog';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { nickname, isSetupDialogOpen, setupDialogMode, setSetupDialog } = useGameStore();
  const { leaveRoom } = useGame();
  const router = useRouter();
  const pathname = usePathname();

  const handleLeave = () => {
    leaveRoom();
    router.push('/');
  };

  const navLinks = [
    { name: 'Mulai', href: '/' },
    { name: 'Cara Main', href: '/#how-to-play' },
    { name: 'Fitur Mantap', href: '/#features' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050a0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden">
            <NextImage 
              src="/image/logo/gglogo.svg" 
              alt="Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="font-[var(--font-display)] text-xl font-bold text-white tracking-wider">
            GAPLE ARENA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand-light ${
                pathname === link.href ? 'text-brand-light' : 'text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {nickname ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <User className="h-4 w-4 text-brand-light" />
                <span className="text-sm font-medium text-white">{nickname}</span>
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
                Ikut Mabar
              </Button>
              <Button
                className="rounded-full bg-brand text-white hover:bg-brand-light border-none font-bold"
                onClick={() => setSetupDialog(true, 'create')}
              >
                Bikin Meja
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#050a0f] p-4 md:hidden">
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
            <div className="h-px w-full bg-white/10 my-2" />
            {nickname ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-white">
                  <User className="h-4 w-4 text-brand-light" />
                  <span>{nickname}</span>
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
                  className="w-full border-brand/50 text-brand-light"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setSetupDialog(true, 'join');
                  }}
                >
                  Ikut Mabar
                </Button>
                <Button
                  className="w-full bg-brand text-white font-bold"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setSetupDialog(true, 'create');
                  }}
                >
                  Bikin Meja
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Dialog Mount */}
      <RoomSetupDialog
        isOpen={isSetupDialogOpen}
        onClose={() => setSetupDialog(false)}
        defaultMode={setupDialogMode}
      />
    </header>
  );
}
