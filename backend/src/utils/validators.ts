import { z } from 'zod';

const playerNameSchema = z.string().trim().min(2).max(20);

export const createRoomSchema = z
  .object({
    playerName: playerNameSchema,
    roomName: z.string().trim().max(30).optional().or(z.literal('')),
    type: z.enum(['public', 'private']),
    password: z.string().min(4).max(30).optional(),
    maxPlayers: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  })
  .superRefine((value, ctx) => {
    if (value.type === 'private' && !value.password?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password wajib diisi untuk room private.',
        path: ['password'],
      });
    }
  });

export const joinRoomSchema = z.object({
  roomCode: z.string().trim().min(4).max(12),
  playerName: playerNameSchema,
  password: z.string().max(30).optional(),
});

export const lookupRoomSchema = z.object({
  roomCode: z.string().trim().min(4).max(12),
});

export const setReadySchema = z.object({
  isReady: z.boolean(),
});

export const kickPlayerSchema = z.object({
  playerId: z.string().min(1),
});

export const playCardSchema = z.object({
  cardId: z.string().min(1),
  side: z.enum(['left', 'right']).optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1).max(180),
});
