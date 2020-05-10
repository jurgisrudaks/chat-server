import { v4 as uuidv4 } from 'uuid';
import http from 'http';

import { clearUsers } from '../store/users';

import logger from '../utils/logger';

export const shutdownHandler = (
  io: SocketIO.Server,
  server: http.Server,
  signal?: string
) => (): void => {
  logger.info(`${signal ? `Received ${signal} ` : ''}Shutting down...`);

  clearUsers();

  io.emit('server_shutting_down', {
    eventId: uuidv4(),
    timestamp: Date.now(),
  });
  logger.debug(`"server_shutting_down" event emitted`);

  io.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
};

export default shutdownHandler;
