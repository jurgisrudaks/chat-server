import { deleteUser, User } from '../../store/users';
import disconnectHandler from '../disconnect';

jest.mock('uuid', () => ({
  v4: (): string => 'unique-test-event-id',
}));
jest.mock('../../store/users');

global.Date.now = jest.fn(() => new Date('2005-06-05T00:00:00Z').getTime());

describe('disconnect handler', () => {
  const ioMock = {
    emit: jest.fn(),
  };

  const socketMock = {
    id: 'test-socket-id',
    handshake: {
      query: {
        username: 'tester-1',
        token: 'test-token',
      },
    },
  };

  const mockUser: User = {
    username: 'tester-1',
    socketId: 'test-socket-id',
    inactivityTimeout: null,
    token: 'test-token',
  };

  it('handle user disconnect', () => {
    const onDisconnect = disconnectHandler(
      ioMock as any,
      socketMock as any,
      mockUser
    );

    onDisconnect();

    expect(ioMock.emit).toHaveBeenLastCalledWith('user_disconnected', {
      eventId: 'unique-test-event-id',
      reason: 'USER_LEFT',
      timestamp: 1117929600000,
      username: 'tester-1',
    });
    expect(deleteUser).toHaveBeenCalledWith(mockUser.username);
  });
});
