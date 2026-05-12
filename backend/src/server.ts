import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocketHandlers } from './socket/socketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    name: 'gaple-game-backend',
    status: 'ok',
  });
});

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

setupSocketHandlers(io);

const port = Number(process.env.PORT || 3001);

httpServer.listen(port, () => {
  console.log(`Gaple backend running on port ${port}`);
});
