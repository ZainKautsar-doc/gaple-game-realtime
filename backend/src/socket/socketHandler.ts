import { randomUUID } from 'crypto';
import type { Server, Socket } from 'socket.io';
import { GameRoom } from '../game/GameRoom';
import { SOCKET_EVENTS } from './events';
import {
  chatMessageSchema,
  createRoomSchema,
  joinRoomSchema,
  kickPlayerSchema,
  lookupRoomSchema,
  playCardSchema,
  setReadySchema,
} from '../utils/validators';

const rooms = new Map<string, GameRoom>();
const autoResetTimers = new Map<string, NodeJS.Timeout>();

const emitRoomsList = (io: Server) => {
  const publicRooms = Array.from(rooms.values())
    .filter((room) => room.type === 'public')
    .map((room) => room.getRoomSummary())
    .sort((left, right) => right.createdAt - left.createdAt);

  io.emit(SOCKET_EVENTS.ROOMS_LIST, publicRooms);
};

const findRoomByPlayer = (playerId: string): GameRoom | null => {
  for (const room of rooms.values()) {
    if (room.findPlayer(playerId)) {
      return room;
    }
  }

  return null;
};

const findRoomByCode = (roomCode: string): GameRoom | null => {
  const normalizedCode = roomCode.trim().toUpperCase();
  for (const room of rooms.values()) {
    if (room.code === normalizedCode) {
      return room;
    }
  }

  return null;
};

const clearRoomResetTimer = (roomId: string) => {
  const timer = autoResetTimers.get(roomId);
  if (timer) {
    clearTimeout(timer);
    autoResetTimers.delete(roomId);
  }
};

const emitRoomState = (io: Server, room: GameRoom) => {
  io.to(room.id).emit(SOCKET_EVENTS.ROOM_STATE, room.getRoomState());
};

const emitGameState = (io: Server, room: GameRoom) => {
  room.getGameState().players.forEach((player) => {
    io.to(player.socketId).emit(SOCKET_EVENTS.GAME_STATE, room.getPlayerView(player.id));
  });
};

const emitTypingState = (io: Server, room: GameRoom) => {
  room.getGameState().players.forEach((player) => {
    io.to(player.socketId).emit(
      SOCKET_EVENTS.TYPING_STATE,
      room.getTypingPlayers(player.id)
    );
  });
};

const emitChatHistory = (socket: Socket, room: GameRoom) => {
  socket.emit(SOCKET_EVENTS.CHAT_HISTORY, room.getChatMessages());
  socket.emit(SOCKET_EVENTS.TYPING_STATE, room.getTypingPlayers(socket.id));
};

const cleanupRoomIfEmpty = (room: GameRoom | null) => {
  if (room && room.isEmpty()) {
    clearRoomResetTimer(room.id);
    rooms.delete(room.id);
  }
};

const scheduleAutoReturn = (io: Server, room: GameRoom) => {
  clearRoomResetTimer(room.id);
  const autoReturnAt = room.getAutoResetAt();
  if (!autoReturnAt) {
    return;
  }

  const delay = Math.max(0, autoReturnAt - Date.now());
  const timer = setTimeout(() => {
    autoResetTimers.delete(room.id);
    room.returnToLobby();
    io.to(room.id).emit(SOCKET_EVENTS.GAME_RESET);
    emitRoomState(io, room);
    emitRoomsList(io);
  }, delay);

  autoResetTimers.set(room.id, timer);
};

const leaveExistingRoom = (io: Server, socket: Socket) => {
  const existingRoom = findRoomByPlayer(socket.id);
  if (!existingRoom) {
    return;
  }

  clearRoomResetTimer(existingRoom.id);
  const previousStatus = existingRoom.getGameState().status;
  socket.leave(existingRoom.id);
  const removedPlayer = existingRoom.removePlayer(socket.id);
  if (removedPlayer) {
    const systemMessage = existingRoom.addSystemMessage(
      `${removedPlayer.nickname} meninggalkan room.`
    );
    if (previousStatus !== 'waiting' && !existingRoom.isEmpty()) {
      io.to(existingRoom.id).emit(SOCKET_EVENTS.GAME_RESET);
    }
    emitRoomState(io, existingRoom);
    emitTypingState(io, existingRoom);
    io.to(existingRoom.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, systemMessage);
    io.to(socket.id).emit(SOCKET_EVENTS.GAME_RESET);
  }
  cleanupRoomIfEmpty(existingRoom);
  emitRoomsList(io);
};

const syncRoomAfterMutation = (io: Server, room: GameRoom) => {
  emitRoomState(io, room);
  emitTypingState(io, room);
  if (room.getGameState().status !== 'waiting') {
    emitGameState(io, room);
  }
  emitRoomsList(io);
};

const createRoomCode = (): string => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = Array.from({ length: 6 }, () => {
      const index = Math.floor(Math.random() * alphabet.length);
      return alphabet[index];
    }).join('');
  } while (findRoomByCode(code));

  return code;
};

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.emit(SOCKET_EVENTS.ROOMS_LIST, []);
    emitRoomsList(io);

    socket.on(SOCKET_EVENTS.GET_ROOMS, () => {
      socket.emit(
        SOCKET_EVENTS.ROOMS_LIST,
        Array.from(rooms.values())
          .filter((room) => room.type === 'public')
          .map((room) => room.getRoomSummary())
          .sort((left, right) => right.createdAt - left.createdAt)
      );
    });

    socket.on(SOCKET_EVENTS.LOOKUP_ROOM, (payload) => {
      const parsed = lookupRoomSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ROOM_LOOKUP_RESULT, {
          found: false,
          message: 'Kode room tidak valid.',
        });
        return;
      }

      const room = findRoomByCode(parsed.data.roomCode);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ROOM_LOOKUP_RESULT, {
          found: false,
          message: 'Room tidak ditemukan.',
        });
        return;
      }

      socket.emit(SOCKET_EVENTS.ROOM_LOOKUP_RESULT, {
        found: true,
        room: room.getRoomSummary(),
      });
    });

    socket.on(SOCKET_EVENTS.CREATE_ROOM, (payload) => {
      const parsed = createRoomSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message:
            parsed.error.issues
              .map((issue) => issue.message)
              .find(Boolean) ?? 'Data room tidak valid.',
        });
        return;
      }

      leaveExistingRoom(io, socket);

      const roomCode = createRoomCode();
      const room = new GameRoom({
        id: randomUUID(),
        name: parsed.data.roomName?.trim() || `Room ${roomCode}`,
        code: roomCode,
        type: parsed.data.type,
        password: parsed.data.password?.trim(),
        maxPlayers: 4,
      });

      rooms.set(room.id, room);
      room.addPlayer({
        id: socket.id,
        socketId: socket.id,
        nickname: parsed.data.playerName.trim(),
      });
      room.addSystemMessage(`${parsed.data.playerName.trim()} membuat room.`);

      socket.join(room.id);
      socket.emit(SOCKET_EVENTS.JOINED_ROOM, {
        playerId: socket.id,
        roomId: room.id,
      });
      emitChatHistory(socket, room);
      syncRoomAfterMutation(io, room);
    });

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload) => {
      const parsed = joinRoomSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: parsed.error.issues[0]?.message ?? 'Data join room tidak valid.',
        });
        return;
      }

      const room = findRoomByCode(parsed.data.roomCode);
      if (!room) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: 'Room tidak ditemukan.',
        });
        return;
      }

      const validation = room.canJoin(parsed.data.password?.trim());
      if (!validation.success) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: validation.error,
        });
        return;
      }

      leaveExistingRoom(io, socket);

      const result = room.addPlayer(
        {
          id: socket.id,
          socketId: socket.id,
          nickname: parsed.data.playerName.trim(),
        },
        parsed.data.password?.trim()
      );

      if (!result.success) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: result.error,
        });
        return;
      }

      socket.join(room.id);
      socket.emit(SOCKET_EVENTS.JOINED_ROOM, {
        playerId: socket.id,
        roomId: room.id,
      });
      emitChatHistory(socket, room);

      const systemMessage = room.addSystemMessage(
        `${parsed.data.playerName.trim()} bergabung ke room.`
      );
      io.to(room.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, systemMessage);
      syncRoomAfterMutation(io, room);
    });

    socket.on(SOCKET_EVENTS.REJOIN_ROOM, (payload) => {
      const { roomId, roomCode, playerName } = payload;
      const room = roomCode ? findRoomByCode(roomCode) : (roomId ? rooms.get(roomId) : null);
      
      if (!room) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: 'Room tidak ditemukan.',
        });
        return;
      }
      
      const result = room.addPlayer({
        id: socket.id,
        socketId: socket.id,
        nickname: playerName || 'Guest',
      });
      
      if (!result.success) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: result.error,
        });
        return;
      }
      
      socket.join(room.id);
      socket.emit(SOCKET_EVENTS.JOINED_ROOM, {
        playerId: socket.id,
        roomId: room.id,
      });
      emitChatHistory(socket, room);
      syncRoomAfterMutation(io, room);
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
      leaveExistingRoom(io, socket);
    });

    socket.on(SOCKET_EVENTS.SET_READY, (payload) => {
      const parsed = setReadySchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Status ready tidak valid.',
        });
        return;
      }

      const room = findRoomByPlayer(socket.id);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Kamu belum bergabung ke room.',
        });
        return;
      }

      const result = room.setReady(socket.id, parsed.data.isReady);
      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: result.error,
        });
        return;
      }

      if (result.message) {
        io.to(room.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, room.addSystemMessage(result.message));
      }
      syncRoomAfterMutation(io, room);
    });

    socket.on(SOCKET_EVENTS.START_GAME, () => {
      const room = findRoomByPlayer(socket.id);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Kamu belum ada di room.',
        });
        return;
      }

      const result = room.startGame(socket.id);
      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: result.error,
        });
        return;
      }

      io.to(room.id).emit(SOCKET_EVENTS.GAME_STARTED, {
        roomId: room.id,
        startedAt: Date.now(),
      });
      io.to(room.id).emit(
        SOCKET_EVENTS.CHAT_MESSAGE,
        room.addSystemMessage('Game dimulai. Semoga gacor.')
      );
      syncRoomAfterMutation(io, room);
    });

    socket.on(SOCKET_EVENTS.KICK_PLAYER, (payload) => {
      const parsed = kickPlayerSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Target kick tidak valid.',
        });
        return;
      }

      const room = findRoomByPlayer(socket.id);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Kamu belum bergabung ke room.',
        });
        return;
      }

      const target = room.findPlayer(parsed.data.playerId);
      const previousStatus = room.getGameState().status;
      const result = room.kickPlayer(socket.id, parsed.data.playerId);
      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: result.error,
        });
        return;
      }

      if (target) {
        io.sockets.sockets.get(target.socketId)?.leave(room.id);
        io.to(target.socketId).emit(SOCKET_EVENTS.PLAYER_KICKED, {
          playerName: target.nickname,
          reason: 'Host mengeluarkan kamu dari room.',
        });
        io.to(target.socketId).emit(SOCKET_EVENTS.GAME_RESET);
      }

      if (previousStatus !== 'waiting' && !room.isEmpty()) {
        io.to(room.id).emit(SOCKET_EVENTS.GAME_RESET);
      }
      if (result.message) {
        io.to(room.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, room.addSystemMessage(result.message));
      }
      syncRoomAfterMutation(io, room);
      cleanupRoomIfEmpty(room);
    });

    socket.on(SOCKET_EVENTS.RETURN_TO_LOBBY, () => {
      const room = findRoomByPlayer(socket.id);
      if (!room) {
        return;
      }

      clearRoomResetTimer(room.id);
      room.returnToLobby();
      io.to(room.id).emit(SOCKET_EVENTS.GAME_RESET);
      emitRoomState(io, room);
      emitRoomsList(io);
    });

    socket.on(SOCKET_EVENTS.PLAY_CARD, (payload) => {
      const parsed = playCardSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Payload kartu tidak valid.',
        });
        return;
      }

      const room = findRoomByPlayer(socket.id);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Kamu belum bergabung ke room.',
        });
        return;
      }

      const result = room.playCard(socket.id, parsed.data.cardId, parsed.data.side);
      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: result.error,
        });
        return;
      }

      if (room.getGameState().status === 'finished') {
        const winner = room.findPlayer(room.getGameState().winner ?? '');
        const message = winner
          ? `${winner.nickname} menang dengan poin paling kecil.`
          : 'Permainan selesai.';
        io.to(room.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, room.addSystemMessage(message));
        scheduleAutoReturn(io, room);
      }

      syncRoomAfterMutation(io, room);
    });

    socket.on(SOCKET_EVENTS.PASS_TURN, () => {
      const room = findRoomByPlayer(socket.id);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Kamu belum bergabung ke room.',
        });
        return;
      }

      const result = room.passTurn(socket.id);
      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: result.error,
        });
        return;
      }

      if (room.getGameState().status === 'finished') {
        const winner = room.findPlayer(room.getGameState().winner ?? '');
        const message = winner
          ? `${winner.nickname} menang karena total poin paling kecil.`
          : 'Permainan selesai.';
        io.to(room.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, room.addSystemMessage(message));
        scheduleAutoReturn(io, room);
      }

      syncRoomAfterMutation(io, room);
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (payload) => {
      const parsed = chatMessageSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Pesan chat kosong atau terlalu panjang.',
        });
        return;
      }

      const room = findRoomByPlayer(socket.id);
      if (!room) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Kamu belum bergabung ke room.',
        });
        return;
      }

      const chatMessage = room.addChatMessage(socket.id, parsed.data.message);
      room.setTyping(socket.id, false);

      if (chatMessage) {
        io.to(room.id).emit(SOCKET_EVENTS.CHAT_MESSAGE, chatMessage);
        emitTypingState(io, room);
      }
    });

    socket.on(SOCKET_EVENTS.TYPING_START, () => {
      const room = findRoomByPlayer(socket.id);
      if (!room) {
        return;
      }

      room.setTyping(socket.id, true);
      emitTypingState(io, room);
    });

    socket.on(SOCKET_EVENTS.TYPING_STOP, () => {
      const room = findRoomByPlayer(socket.id);
      if (!room) {
        return;
      }

      room.setTyping(socket.id, false);
      emitTypingState(io, room);
    });

    socket.on('disconnect', () => {
      leaveExistingRoom(io, socket);
    });
  });
}
