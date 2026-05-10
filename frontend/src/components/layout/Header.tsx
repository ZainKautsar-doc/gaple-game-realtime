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

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    
    handleHashChange();
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
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

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

  const navLinkClass = (href: string) =>
    `font-mono text-sm font-bold uppercase tracking-wide border-[3px] border-transparent px-3 py-2 ${
      isActive(href)
        ? 'bg-nb-primary text-nb-white border-nb-outline shadow-nb-sm'
        : 'text-nb-on-surface hover:bg-nb-primary hover:text-nb-white hover:border-nb-outline'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-nb-outline bg-nb-surface">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-none border-[3px] border-nb-outline bg-nb-white p-2 shadow-nb-sm">
            <NextImage 
              src="/image/logo/gglogo.svg" 
              alt="Logo" 
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <span className="font-display text-xl uppercase tracking-wide text-nb-primary">
              Gaple Arena
            </span>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-nb-on-surface">
              Domino multiplayer online
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={navLinkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {nickname ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-none border-[3px] border-nb-outline bg-nb-white px-3 py-2 shadow-nb-sm">
                <User className="h-4 w-4 text-nb-primary" />
                <span className="font-mono text-sm font-bold text-nb-on-surface">{nickname}</span>
                {roomState?.code && (
                  <span className="rounded-none border-[2px] border-nb-outline bg-nb-secondary px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-nb-on-surface">
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
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cabut
                </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setSetupDialog(true, 'join')}
              >
                <DoorOpen className="mr-2 h-4 w-4" />
                Join Room
              </Button>
              <Button
                variant="primary"
                onClick={() => setSetupDialog(true, 'create')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden border-[3px] border-nb-outline bg-nb-white p-2 shadow-nb-sm text-nb-on-surface hover:bg-nb-secondary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 1 }}
            transition={{ duration: 0 }}
            className="overflow-hidden border-b-[3px] border-nb-outline bg-nb-surface md:hidden"
          >
            <nav className="flex flex-col gap-2 max-w-[1400px] mx-auto p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${navLinkClass(link.href)} text-left`}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full bg-nb-outline border-0" />
              {nickname ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-none border-[3px] border-nb-outline bg-nb-white px-4 py-3 shadow-nb-sm text-nb-on-surface">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-nb-primary" />
                      <span className="font-mono text-sm font-bold">{nickname}</span>
                    </div>
                    {roomState?.code && (
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-nb-primary">
                        {roomState.code}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isInRoom && (
                      <Button 
                        variant="outline" 
                        className="flex-1" 
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
                    <Button variant="danger" className="flex-1" onClick={handleLeave}>
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
