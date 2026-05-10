import { z } from 'zod';

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().max(30).optional());

const playerNameSchema = z
  .string({
    required_error: 'Nama pemain wajib diisi.',
    invalid_type_error: 'Nama pemain harus berupa teks.',
  })
  .trim()
  .min(2, 'Nama pemain harus 2-20 karakter.')
  .max(20, 'Nama pemain harus 2-20 karakter.');

export const createRoomSchema = z
  .object({
    playerName: playerNameSchema,
    avatarId: z.string().min(1).max(20),
    roomName: optionalTrimmedString,
    type: z.enum(['public', 'private'], {
      required_error: 'Tipe room wajib dipilih.',
      invalid_type_error: 'Tipe room tidak valid.',
    }),
    password: z
      .string({
        invalid_type_error: 'Password room tidak valid.',
      })
      .trim()
      .max(30, 'Password maksimal 30 karakter.')
      .optional()
      .or(z.literal('')),
    maxPlayers: z.literal(4).optional(),
  })
  .superRefine((value, ctx) => {
    const password = value.password?.trim();

    if (value.type === 'private' && !password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password wajib diisi untuk room private.',
        path: ['password'],
      });
      return;
    }

    if (value.type === 'private' && password && password.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password room private minimal 4 karakter.',
        path: ['password'],
      });
    }
  });

export const joinRoomSchema = z.object({
  roomCode: z.string().trim().min(4).max(12),
  playerName: playerNameSchema,
  avatarId: z.string().min(1).max(20),
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
