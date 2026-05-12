"use client";

import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "http://localhost:3001";

let socketInstance:
  | Socket<ServerToClientEvents, ClientToServerEvents>
  | null = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(socketUrl);
  }

  return socketInstance;
}