import { v4 as uuidv4 } from 'uuid';

import { User } from '../store/users';

import { resetUserActivityTimer } from '../utils/activity';
import logger from '../utils/logger';

type Message = {
  message: string;
};

const messageHandler = (
  io: SocketIO.Server,
  socket: SocketIO.Socket,
  user: User
) => ({ message }: Message): void => {
  logger.info(`[${socket.id}][${user.username}]: ${message}`);

  io.emit('message', {
    eventId: uuidv4(),
    username: user.username,
    message,
    timestamp: Date.now(),
  });
  logger.debug(
    `[${socket.id}][${user.username}] "message" event emitted - message "${message}"`
  );

  resetUserActivityTimer(io, socket);
};

export default messageHandler;
