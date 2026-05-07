'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  title = 'Table Chat',
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
    <div className="casino-card flex h-full flex-col border-casino-gold/15 bg-casino-bg-surface overflow-hidden">
      <div className="border-b border-casino-gold/10 p-4">
        <h3 className="text-xl font-bold text-casino-gold tracking-tight">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex max-h-[400px] min-h-[400px] flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-casino-gold/10 bg-black/20 p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <p className="text-sm text-casino-text-muted font-bold italic">
                No messages yet. <br/> Start the conversation!
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
                        className="mx-auto rounded-full border border-casino-gold/10 bg-black/30 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-casino-text-secondary"
                      >
                        {message.message}
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
                          <p className="px-1 text-[10px] font-bold text-casino-gold opacity-80">
                            {message.nickname}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 text-sm shadow-sm transition-all ${
                            isMe
                              ? 'rounded-tr-none bg-casino-gold text-black border border-casino-gold/30 shadow-casino-glow'
                              : 'rounded-tl-none bg-black/40 text-casino-text-primary border border-casino-gold/20'
                          }`}
                        >
                          {message.message}
                        </div>
                        <span className="px-1 text-[9px] font-bold text-casino-text-muted">
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
            <p className="animate-pulse text-[11px] text-casino-gold font-bold italic px-2">
              {visibleTypingPlayers.map((player) => player.nickname).join(', ')} is typing...
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-3">
          <Textarea
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder="Type a message..."
            className="min-h-[96px] input-casino rounded-xl resize-none"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
          />
          <Button
            variant="primary"
            className="w-full rounded-xl"
            onClick={submitMessage}
            disabled={!draft.trim()}
          >
            <SendHorizontal className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
