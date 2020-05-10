import { v4 as uuidv4 } from 'uuid';

import { deleteUser } from '../store/users';
import logger from '../utils/logger';

type User = {
  username: string;
  socketId: string | null;
  inactivityTimeout: NodeJS.Timeout | null;
  token: string;
};

export enum DisconnectionReason {
  'USER_INACTIVE' = 'USER_INACTIVE',
  'USER_LEFT' = 'USER_LEFT',
  'SERVER_SHUTTING_DOWN' = 'SERVER_SHUTTING_DOWN',
}

const disconnectHandler = (
  io: SocketIO.Server,
  socket: SocketIO.Socket,
  user: User
) => (): void => {
  logger.info(`[${socket.id}][${user.username}] disconnected`);

  if (user.inactivityTimeout) {
    logger.debug(`[${socket.id}][${user.username}] inactivity timer cleared`);
    clearTimeout(user.inactivityTimeout);
  }

  io.emit('user_disconnected', {
    eventId: uuidv4(),
    username: user.username,
    reason: DisconnectionReason.USER_LEFT,
    timestamp: Date.now(),
  });
  logger.debug(
    `[${socket.id}][${user.username}] "user_disconnected" event emitted - reason "${DisconnectionReason.USER_LEFT}"`
  );

  deleteUser(user.username);
  logger.debug(`[${socket.id}][${user.username}] user was deleted`);
};

export default disconnectHandler;
