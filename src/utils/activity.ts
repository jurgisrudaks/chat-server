import { v4 as uuidv4 } from 'uuid';

import { getUser, deleteUser } from '../store/users';

import logger from './logger';

enum DisconnectionReason {
  'USER_INACTIVE' = 'USER_INACTIVE',
  'USER_LEFT' = 'USER_LEFT',
}

export const resetUserActivityTimer = (
  io: SocketIO.Server,
  socket: SocketIO.Socket
): void => {
  logger.debug(
    `[${socket.id}][${socket.handshake.query.username}] attempting to reset inactivity timer`
  );

  const user = getUser(socket.handshake.query.username);

  if (!user) {
    logger.error(
      `[${socket.id}][${socket.handshake.query.username}] user not found - failed to reset inactivity timeout`
    );

    return;
  }

  if (user.inactivityTimeout) {
    clearTimeout(user.inactivityTimeout);
    logger.debug(`[${socket.id}][${user.username}] inactivity timer cleared`);
  }

  user.inactivityTimeout = setTimeout(() => {
    io.emit('user_disconnected', {
      eventId: uuidv4(),
      username: user.username,
      reason: DisconnectionReason.USER_INACTIVE,
      timestamp: Date.now(),
    });
    logger.debug(
      `[${socket.id}][${user.username}] "user_disconnected" event emitted - reason "${DisconnectionReason.USER_INACTIVE}"`
    );

    socket.disconnect(true);
    logger.debug(`[${socket.id}][${user.username}] socket disconnected`);

    deleteUser(user.username);
    logger.debug(`[${socket.id}][${user.username}] user was deleted`);

    logger.info(
      `[${socket.id}][${user.username}] was disconnected due to inactivity`
    );
  }, parseInt(process.env.USER_INACTIVITY_TIMEOUT, 10) * 1000);
};

export default { resetUserActivityTimer };
