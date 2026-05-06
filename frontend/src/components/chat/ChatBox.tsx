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
        <div className="flex min-h-[280px] flex-1 flex-col gap-3 overflow-y-auto rounded-[28px] border border-white/10 bg-black/20 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">
              Belum ada chat. Pecah suasana meja dulu.
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.kind === 'system'
                    ? 'rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-300'
                    : 'rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2'
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    {message.nickname}
                  </p>
                  <span className="text-xs text-slate-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{message.message}</p>
              </div>
            ))
          )}
          {visibleTypingPlayers.length > 0 && (
            <p className="text-sm text-aqua">
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
