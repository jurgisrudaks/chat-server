import { User } from '../../store/users';
import { resetUserActivityTimer } from '../../utils/activity';

import messageHandler from '../message';

jest.mock('uuid', () => ({
  v4: (): string => 'unique-test-event-id',
}));
jest.mock('../../store/users');
jest.mock('../../utils/activity');

global.Date.now = jest.fn(() => new Date('2005-06-05T00:00:00Z').getTime());

describe('message handler', () => {
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

  it('handle message received', () => {
    const testMessage = 'This is a test message';

    const onMesage = messageHandler(ioMock as any, socketMock as any, mockUser);
    onMesage({ message: testMessage });

    expect(ioMock.emit).toHaveBeenLastCalledWith('message', {
      eventId: 'unique-test-event-id',
      message: testMessage,
      timestamp: 1117929600000,
      username: 'tester-1',
    });
    expect(resetUserActivityTimer).toHaveBeenCalled();
  });
});
