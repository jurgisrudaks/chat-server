import { getUser } from '../../store/users';
import socketAuthMiddleWare from '../socket-auth';

jest.mock('../../store/users');

describe('Socket auth middleware', () => {
  const nextMock = jest.fn();
  let socketMock: {
    id: string;
    handshake: {
      query: {
        username: string;
        token: string;
      };
    };
  };

  beforeEach(() => {
    socketMock = {
      id: 'test-socket-id',
      handshake: {
        query: {
          username: 'tester-1',
          token: 'test-token',
        },
      },
    };
  });

  it('handle user not found', () => {
    (getUser as jest.Mock).mockImplementationOnce(() => undefined);

    socketAuthMiddleWare(socketMock as any, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Not authorized!'));
  });

  it("handle user found but token doesnt't match", () => {
    (getUser as jest.Mock).mockImplementationOnce((username) => ({
      username,
      socketId: 'test-socket-id',
      inactivityTimeout: null,
      token: 'test-token',
    }));

    socketMock = {
      id: 'test-socket-id',
      handshake: {
        query: {
          username: 'tester-1',
          token: 'invalid-token',
        },
      },
    };

    socketAuthMiddleWare(socketMock as any, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Not authorized!'));
  });

  it('should handle authorised access', () => {
    (getUser as jest.Mock).mockImplementationOnce((username) => ({
      username,
      socketId: 'test-socket-id',
      inactivityTimeout: null,
      token: 'test-token',
    }));

    socketAuthMiddleWare(socketMock as any, nextMock);

    expect(nextMock).toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith();
  });
});
