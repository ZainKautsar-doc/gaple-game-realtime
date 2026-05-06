export const SOCKET_EVENTS = {
  JOIN_ROOM: 'join-room',
  JOINED_ROOM: 'joined-room',
  JOIN_FAILED: 'join-failed',
  LEAVE_ROOM: 'leave-room',
  ROOM_STATE: 'room-state',
  GAME_STARTED: 'game-started',
  GAME_STATE: 'game-state',
  PLAY_CARD: 'play-card',
  PASS_TURN: 'pass-turn',
  ACTION_ERROR: 'action-error',
  CHAT_HISTORY: 'chat-history',
  CHAT_MESSAGE: 'chat-message',
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  TYPING_STATE: 'typing-state',
} as const;

