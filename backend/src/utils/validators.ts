import { z } from 'zod';

export const joinRoomSchema = z.object({
  nickname: z.string().trim().min(2).max(18),
});

export const playCardSchema = z.object({
  cardId: z.string().min(1),
  side: z.enum(['left', 'right']).optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1).max(180),
});

