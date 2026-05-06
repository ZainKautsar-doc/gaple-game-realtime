'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatTime } from '@/lib/game';
import type { ChatMessage, TypingPlayer } from '@/types/game';

interface ChatBoxProps {
  title?: string;
  messages: ChatMessage[];
  typingPlayers: TypingPlayer[];
  currentPlayerId: string | null;
  onSendMessage: (message: string) => void;
  onTypingChange: (isTyping: boolean) => void;
}

export function ChatBox({
  title = 'Bacotan Meja',
  messages,
  typingPlayers,
  currentPlayerId,
  onSendMessage,
  onTypingChange,
}: ChatBoxProps) {
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingPlayers]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const submitMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    onSendMessage(trimmed);
    onTypingChange(false);
    setDraft('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleDraftChange = (value: string) => {
    setDraft(value);
    onTypingChange(value.trim().length > 0);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTypingChange(false);
    }, 1200);
  };

  const visibleTypingPlayers = typingPlayers.filter(
    (player) => player.playerId !== currentPlayerId
  );

  return (
    <Card className="section-shell flex h-full flex-col border-white/10 bg-[#0a1219]/80 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-white font-[var(--font-display)] text-xl tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex max-h-[400px] min-h-[400px] flex-1 flex-col gap-3 overflow-y-auto rounded-[28px] border border-white/10 bg-black/20 p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <p className="text-sm text-slate-500 font-medium italic">
                Belum ada bacotan nih. <br/> Pecah suasana meja dulu cuy!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {messages.map((message) => {
                  const isMe = message.playerId === currentPlayerId;
                  const isSystem = message.kind === 'system';

                  if (isSystem) {
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mx-auto rounded-full border border-white/5 bg-white/[0.05] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                      >
                        {message.message.replace('telah bergabung', 'masuk meja').replace('telah keluar', 'cabut')}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`flex max-w-[85%] flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && (
                          <p className="px-1 text-[10px] font-black text-brand-light opacity-80">
                            {message.nickname}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 text-sm shadow-md transition-all ${
                            isMe
                              ? 'rounded-tr-none bg-brand text-[#081126] border border-brand-light/30 shadow-brand/10'
                              : 'rounded-tl-none bg-white/[0.07] text-slate-200 border border-white/10'
                          }`}
                        >
                          {message.message}
                        </div>
                        <span className="px-1 text-[9px] font-bold text-slate-600">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          {visibleTypingPlayers.length > 0 && (
            <p className="animate-pulse text-[11px] text-brand-light font-bold italic px-2">
              {visibleTypingPlayers.map((player) => player.nickname).join(', ')} lagi ngetik...
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-3">
          <Textarea
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder="Ketik bacotan lu..."
            className="min-h-[96px] border-white/10 bg-white/5 focus:border-brand-light transition-all rounded-2xl"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
          />
          <Button
            className="w-full bg-brand hover:bg-brand-light text-white font-black rounded-xl border-none shadow-lg shadow-brand/20 transition-all"
            onClick={submitMessage}
            disabled={!draft.trim()}
          >
            <SendHorizontal className="mr-2 h-4 w-4" />
            GAS KIRIM
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
