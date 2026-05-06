import type { Server, Socket } from 'socket.io';
import { GameRoom } from '../game/GameRoom';
import { SOCKET_EVENTS } from './events';
import {
  chatMessageSchema,
  joinRoomSchema,
  playCardSchema,
} from '../utils/validators';

const ROOM_ID = 'main-room';
const COUNTDOWN_MS = 3000;

const rooms = new Map<string, GameRoom>();
let countdownTimer: NodeJS.Timeout | null = null;

const getRoom = (): GameRoom => {
  if (!rooms.has(ROOM_ID)) {
    rooms.set(ROOM_ID, new GameRoom(ROOM_ID));
  }

  return rooms.get(ROOM_ID)!;
};

const emitPlayerStates = (io: Server, room: GameRoom) => {
  room.getGameState().players.forEach((player) => {
    io.to(player.socketId).emit(
      SOCKET_EVENTS.GAME_STATE,
      room.getPlayerView(player.id)
    );
  });
};

const emitRoomState = (io: Server, room: GameRoom) => {
  io.to(ROOM_ID).emit(SOCKET_EVENTS.ROOM_STATE, room.getRoomState());
};

const emitTypingState = (io: Server, room: GameRoom) => {
  io.to(ROOM_ID).emit(SOCKET_EVENTS.TYPING_STATE, room.getTypingPlayers());
};

const clearCountdown = (room: GameRoom) => {
  if (countdownTimer) {
    clearTimeout(countdownTimer);
    countdownTimer = null;
  }
  room.clearCountdown();
};

const maybeStartCountdown = (io: Server, room: GameRoom) => {
  if (!room.shouldStartCountdown()) {
    return;
  }

  const countdownEndsAt = Date.now() + COUNTDOWN_MS;
  room.setCountdown(countdownEndsAt);
  const systemMessage = room.addSystemMessage(
    'Meja penuh. Ronde akan dimulai dalam 3 detik.'
  );
  emitRoomState(io, room);
  io.to(ROOM_ID).emit(SOCKET_EVENTS.CHAT_MESSAGE, systemMessage);

  countdownTimer = setTimeout(() => {
    countdownTimer = null;

    const latestRoom = getRoom();
    if (
      latestRoom.getGameState().players.length !== 4 ||
      latestRoom.getGameState().status !== 'countdown'
    ) {
      latestRoom.clearCountdown();
      emitRoomState(io, latestRoom);
      return;
    }

    latestRoom.startGame();
    io.to(ROOM_ID).emit(SOCKET_EVENTS.GAME_STARTED, {
      roomId: ROOM_ID,
      startedAt: Date.now(),
    });
    emitRoomState(io, latestRoom);
    emitPlayerStates(io, latestRoom);
  }, COUNTDOWN_MS);
};

const handlePlayerLeave = (io: Server, socketId: string) => {
  const room = getRoom();
  const player = room.findPlayer(socketId);
  if (!player) {
    return;
  }

  clearCountdown(room);
  room.removePlayer(player.id);
  const systemMessage = room.addSystemMessage(
    `${player.nickname} meninggalkan meja.`
  );

  emitRoomState(io, room);
  emitTypingState(io, room);
  io.to(ROOM_ID).emit(SOCKET_EVENTS.CHAT_MESSAGE, systemMessage);
};

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload) => {
      const room = getRoom();
      const parsed = joinRoomSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: 'Nickname harus berisi 2-18 karakter.',
        });
        return;
      }

      const joinResult = room.addPlayer({
        id: socket.id,
        socketId: socket.id,
        nickname: parsed.data.nickname,
      });

      if (!joinResult.success) {
        socket.emit(SOCKET_EVENTS.JOIN_FAILED, {
          message: joinResult.error,
        });
        return;
      }

      socket.join(ROOM_ID);
      socket.emit(SOCKET_EVENTS.JOINED_ROOM, {
        playerId: socket.id,
        roomId: ROOM_ID,
      });
      socket.emit(SOCKET_EVENTS.CHAT_HISTORY, room.getChatMessages());
      socket.emit(SOCKET_EVENTS.TYPING_STATE, room.getTypingPlayers(socket.id));

      const systemMessage = room.addSystemMessage(
        `${parsed.data.nickname} bergabung ke meja.`
      );

      emitRoomState(io, room);
      io.to(ROOM_ID).emit(SOCKET_EVENTS.CHAT_MESSAGE, systemMessage);
      maybeStartCountdown(io, room);

      if (room.getGameState().status === 'playing') {
        emitPlayerStates(io, room);
      }
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
      socket.leave(ROOM_ID);
      handlePlayerLeave(io, socket.id);
    });

    socket.on(SOCKET_EVENTS.PLAY_CARD, (payload) => {
      const parsed = playCardSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Payload kartu tidak valid.',
        });
        return;
      }

      const room = getRoom();
      const result = room.playCard(
        socket.id,
        parsed.data.cardId,
        parsed.data.side
      );

      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: result.error,
        });
        return;
      }

      emitRoomState(io, room);
      emitPlayerStates(io, room);
      emitTypingState(io, room);

      if (room.getGameState().status === 'finished') {
        const winner = room.findPlayer(room.getGameState().winner ?? '');
        const winMessage = room.addSystemMessage(
          winner ? `${winner.nickname} memenangkan ronde.` : 'Ronde selesai.'
        );
        io.to(ROOM_ID).emit(SOCKET_EVENTS.CHAT_MESSAGE, winMessage);
      }
    });

    socket.on(SOCKET_EVENTS.PASS_TURN, () => {
      const room = getRoom();
      const result = room.passTurn(socket.id);

      if (!result.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: result.error,
        });
        return;
      }

      emitRoomState(io, room);
      emitPlayerStates(io, room);
      emitTypingState(io, room);

      if (room.getGameState().status === 'finished') {
        const winner = room.findPlayer(room.getGameState().winner ?? '');
        const winMessage = room.addSystemMessage(
          winner
            ? `${winner.nickname} memenangkan ronde karena pip paling kecil.`
            : 'Ronde selesai.'
        );
        io.to(ROOM_ID).emit(SOCKET_EVENTS.CHAT_MESSAGE, winMessage);
      }
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (payload) => {
      const parsed = chatMessageSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ACTION_ERROR, {
          message: 'Pesan chat kosong atau terlalu panjang.',
        });
        return;
      }

      const room = getRoom();
      const chatMessage = room.addChatMessage(socket.id, parsed.data.message);
      room.setTyping(socket.id, false);

      if (chatMessage) {
        io.to(ROOM_ID).emit(SOCKET_EVENTS.CHAT_MESSAGE, chatMessage);
        emitTypingState(io, room);
      }
    });

    socket.on(SOCKET_EVENTS.TYPING_START, () => {
      const room = getRoom();
      room.setTyping(socket.id, true);
      emitTypingState(io, room);
    });

    socket.on(SOCKET_EVENTS.TYPING_STOP, () => {
      const room = getRoom();
      room.setTyping(socket.id, false);
      emitTypingState(io, room);
    });

    socket.on('disconnect', () => {
      handlePlayerLeave(io, socket.id);
    });
  });
}

