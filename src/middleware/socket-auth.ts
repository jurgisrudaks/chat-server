import { getUser } from '../store/users';
import logger from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const socketAuth: (socket: SocketIO.Socket, fn: (err?: any) => void) => void = (
  socket,
  next
) => {
  const handshakeData = socket.handshake.query;
  const user = getUser(handshakeData.username);

  if (!user || (user && user.token !== handshakeData.token)) {
    logger.error(
      `[${socket.id}]${
        user?.username || handshakeData?.username
          ? `[${handshakeData.username}] `
          : ''
      } unauthorised`
    );
    return next(new Error('Not authorized!'));
  }

  return next();
};

export default socketAuth;
