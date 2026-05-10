'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import { Menu, Sparkles, X, LogOut, User, Plus, DoorOpen, LayoutGrid, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useGame } from '@/hooks/useGame';
import { useNavigationStore } from '@/store/navigationStore';
import { RoomSetupDialog } from '@/components/dialog/RoomSetupDialog';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  
  const { nickname, setNickname, isSetupDialogOpen, setupDialogMode, setSetupDialog } =
    useGameStore();
  const { isInRoom, currentRoomId } = useNavigationStore();
  const { leaveRoom, roomState, joinRoom, isSubmitting, joinedRoom } = useGame();
  const router = useRouter();
  const pathname = usePathname();

  // Update active hash on mount and when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    
    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLeave = () => {
    leaveRoom();
    setNickname('');
    router.push('/');
  };

  const handleGoToRoom = () => {
    if (roomState) {
      if (roomState.status === 'playing') {
        router.push('/game');
      } else {
        router.push('/lobby');
      }
    } else if (isInRoom && currentRoomId) {
      joinRoom({ roomCode: useNavigationStore.getState().currentRoomCode || '', playerName: nickname });
    }
  };

  // Effect to navigate after re-joining
  useEffect(() => {
    if (joinedRoom && (pathname === '/' || pathname === '/#how-to-play' || pathname === '/#features')) {
      if (roomState?.status === 'playing') {
        router.push('/game');
      } else if (roomState?.status === 'waiting') {
        router.push('/lobby');
      }
    }
  }, [joinedRoom, roomState?.status, router, pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How to Play', href: '/#how-to-play' },
    { name: 'Feature', href: '/#features' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' && activeHash === '';
    if (href.startsWith('/#')) {
      const hash = href.split('#')[1];
      return pathname === '/' && activeHash === `#${hash}`;
    }
    return pathname === href;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle smooth scroll if we're already on the home page
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Offset for sticky header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update URL hash without jumping and update state
        window.history.pushState(null, '', href);
        setActiveHash(`#${id}`);
      }
    } else if (href === '/' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      setActiveHash('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#072820]/95 backdrop-blur-md border-b border-casino-gold/15">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-casino-gold/30 bg-casino-bg-surface p-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <NextImage 
              src="/image/logo/gglogo.svg" 
              alt="Logo" 
              fill
              className="object-contain p-2"
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider text-casino-gold">
              GAPLE ARENA
            </span>
            <p className="text-[10px] uppercase tracking-[0.28em] text-casino-text-muted">
              Domino Multiplayer Online
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`group relative text-sm font-medium transition-colors hover:text-casino-gold-light ${
                isActive(link.href) ? 'text-casino-gold' : 'text-casino-text-secondary'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 bg-casino-gold ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {nickname ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-casino-gold/20 bg-casino-bg-surface px-3 py-1.5">
                <User className="h-4 w-4 text-casino-gold" />
                <span className="text-sm font-medium text-casino-text-primary">{nickname}</span>
                {roomState?.code && (
                  <span className="rounded-full border border-casino-gold/30 bg-casino-gold/10 px-2 py-0.5 text-[10px] text-casino-gold">
                    {roomState.code}
                  </span>
                )}
              </div>
                {isInRoom && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoToRoom}
                    disabled={isSubmitting}
                    className="rounded-full border-casino-gold/30 text-casino-gold hover:bg-casino-gold/10"
                    title="Kembali ke Room"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LayoutGrid className="mr-2 h-4 w-4" />
                    )}
                    Room
                  </Button>
                )}
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
                className="rounded-full"
                onClick={() => setSetupDialog(true, 'join')}
              >
                <DoorOpen className="mr-2 h-4 w-4" />
                Join Room
              </Button>
              <Button
                variant="primary"
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
          className="md:hidden text-casino-text-secondary hover:text-casino-gold"
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
            className="absolute top-16 left-0 w-full border-b border-casino-gold/15 bg-[#072820]/95 p-4 shadow-lg backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col gap-4 max-w-[1400px] mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium hover:text-casino-gold-light ${
                    isActive(link.href) ? 'text-casino-gold' : 'text-casino-text-secondary'
                  }`}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full bg-casino-gold/10" />
              {nickname ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-casino-gold/20 bg-casino-bg-surface px-4 py-3 text-casino-text-primary">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-casino-gold" />
                      <span>{nickname}</span>
                    </div>
                    {roomState?.code && (
                      <span className="text-xs font-mono tracking-[0.24em] text-casino-gold">
                        {roomState.code}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isInRoom && (
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-full border-casino-gold/30 text-casino-gold hover:bg-casino-gold/10" 
                        onClick={() => {
                          handleGoToRoom();
                          setIsMobileMenuOpen(false);
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <LayoutGrid className="mr-2 h-4 w-4" />
                        )}
                        Room
                      </Button>
                    )}
                    <Button variant="danger" className="flex-1 rounded-full" onClick={handleLeave}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cabut
                    </Button>
                  </div>
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
                    variant="primary"
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
