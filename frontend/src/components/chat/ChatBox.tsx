'use client';

import { useEffect, useRef, useState } from 'react';
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
  title = 'Room Chat',
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
    <Card className="section-shell flex h-full flex-col">
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex max-h-[400px] min-h-[400px] flex-1 flex-col gap-3 overflow-y-auto rounded-[28px] border border-white/10 bg-black/20 p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-slate-400">
                Belum ada chat. Pecah suasana meja dulu.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((message) => {
                const isMe = message.playerId === currentPlayerId;
                const isSystem = message.kind === 'system';

                if (isSystem) {
                  return (
                    <div
                      key={message.id}
                      className="mx-auto rounded-full border border-white/5 bg-white/[0.05] px-4 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-400"
                    >
                      {message.message}
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex max-w-[85%] flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && (
                        <p className="px-1 text-[11px] font-semibold text-slate-400">
                          {message.nickname}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm shadow-sm transition-all ${
                          isMe
                            ? 'rounded-tr-none bg-gradient-to-br from-mint/30 via-mint/20 to-mint/10 text-mint border border-mint/30 shadow-mint/10 hover:shadow-mint/20'
                            : 'rounded-tl-none bg-white/[0.07] text-white border border-white/10 shadow-black/20 hover:bg-white/[0.1]'
                        }`}
                      >
                        {message.message}
                      </div>
                      <span className="px-1 text-[10px] text-slate-500">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {visibleTypingPlayers.length > 0 && (
            <p className="animate-pulse text-xs text-aqua/70 italic">
              {visibleTypingPlayers.map((player) => player.nickname).join(', ')} sedang mengetik...
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-3">
          <Textarea
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder="Ketik pesan ke meja..."
            className="min-h-[96px]"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
          />
          <Button
            className="w-full"
            onClick={submitMessage}
            disabled={!draft.trim()}
          >
            <SendHorizontal className="mr-2 h-4 w-4" />
            Kirim pesan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
