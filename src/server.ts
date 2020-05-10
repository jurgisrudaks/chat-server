import cors from 'cors';
import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import './utils/secrets';

import { getUser } from './store/users';

import socketAuth from './middleware/socket-auth';

import messageHandler from './handlers/message';
import disconnectHandler from './handlers/disconnect';
import shutdownHandler from './handlers/shutdown';

import loginRoute from './routes/login';

import { resetUserActivityTimer } from './utils/activity';
import logger from './utils/logger';

export const app = express();
export const server = http.createServer(app);
export const io = socketIo(server);

// When developing locally enable CORS to allow requests to be made across ports
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// Express server setup
app.use(express.json());
app.post('/login', loginRoute);

// Socket.io middleware
io.use(socketAuth);

io.on('connection', (socket) => {
  const user = getUser(socket.handshake.query.username);
  logger.info(`[${socket.id}][${user.username}] connected`);

  // Clear any existing timers and reset
  resetUserActivityTimer(io, socket);

  io.emit('user_connected', {
    eventId: uuidv4(),
    username: user.username,
    timestamp: Date.now(),
  });

  // Event handlers
  socket.on('message', messageHandler(io, socket, user));
  socket.on('disconnect', disconnectHandler(io, socket, user));
});

server.listen(process.env.PORT || 3001);

process.on('SIGINT', shutdownHandler(io, server, 'SIGINT'));
process.on('SIGTERM', shutdownHandler(io, server, 'SIGTERM'));
