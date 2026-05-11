'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatTime } from '@/lib/game';
import { getAvatarById } from '@/lib/avatars';
import { Avatar } from '@/components/ui/avatar';
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
    <div className="flex h-full flex-col overflow-hidden border-[3px] border-nb-outline bg-nb-white shadow-nb-sm">
      <div className="border-b-[3px] border-nb-outline bg-nb-primary px-4 py-4">
        <h3 className="font-display text-xl uppercase tracking-wide text-nb-white">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 bg-nb-surface">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto border-[3px] border-nb-outline bg-nb-white p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <p className="font-mono text-sm font-bold text-nb-placeholder uppercase">
                No messages yet. <br /> Start the conversation!
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
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        className="mx-auto border-[3px] border-nb-outline bg-nb-surface-low px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-nb-on-surface text-center max-w-[95%]"
                      >
                        {message.message}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={message.id}
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 1 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`flex max-w-[85%] flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && (
                          <p className="px-1 font-mono text-[10px] font-bold uppercase text-nb-primary">
                            {message.nickname}
                          </p>
                        )}
                        <div className="flex gap-2 items-end">
                          {!isMe && message.avatarId && (
                            <Avatar className="h-8 w-8 text-sm shrink-0 mb-1">
                              {getAvatarById(message.avatarId).emoji}
                            </Avatar>
                          )}
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`border-[3px] border-nb-outline px-4 py-2 font-mono text-sm font-medium ${
                                isMe
                                  ? 'bg-nb-white text-nb-on-surface shadow-nb-sm'
                                  : 'bg-nb-surface-low text-nb-on-surface shadow-nb-sm'
                              }`}
                            >
                              {message.message}
                            </div>
                          </div>
                          {isMe && message.avatarId && (
                            <Avatar className="h-8 w-8 text-sm shrink-0 mb-1">
                              {getAvatarById(message.avatarId).emoji}
                            </Avatar>
                          )}
                        </div>
                        <span className="px-1 font-mono text-[9px] font-bold text-nb-placeholder uppercase">
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
            <p className="animate-nb-pulse font-mono text-[11px] font-bold uppercase px-2 text-nb-primary border-[3px] border-nb-outline py-2">
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
            className="min-h-[96px]"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
          />
          <Button
            variant="primary"
            className="w-full"
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
