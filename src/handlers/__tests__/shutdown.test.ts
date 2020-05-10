import { clearUsers } from '../../store/users';

import shutdownHandler from '../shutdown';

jest.mock('uuid', () => ({
  v4: (): string => 'unique-test-event-id',
}));
jest.mock('../../store/users');

global.Date.now = jest.fn(() => new Date('2005-06-05T00:00:00Z').getTime());

describe('shutdown handler', () => {
  const serverMock = {
    close: jest.fn(),
  };

  const ioMock = {
    emit: jest.fn(),
    close: jest.fn(() => {
      serverMock.close();
    }),
  };

  it('greacefully handle shutdown', () => {
    const onShutdown = shutdownHandler(
      ioMock as any,
      serverMock as any,
      'SIGTERM'
    );
    onShutdown();

    expect(ioMock.emit).toHaveBeenLastCalledWith('server_shutting_down', {
      eventId: 'unique-test-event-id',
      timestamp: 1117929600000,
    });
    expect(clearUsers).toHaveBeenCalled();
    expect(ioMock.close).toHaveBeenCalled();
    expect(serverMock.close).toHaveBeenCalled();
  });
});
