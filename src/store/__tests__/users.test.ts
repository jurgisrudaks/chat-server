import {
  createUser,
  users,
  User,
  deleteUser,
  getUser,
  clearUsers,
} from '../users';

describe('user store', () => {
  const getTestUser: (username: string) => User = (username) => ({
    username,
    socketId: null,
    inactivityTimeout: null,
    token: 'test-token',
  });

  it('createUser', () => {
    const user = getTestUser('tester-1');

    createUser(user);
    expect(users[user.username]).toStrictEqual(user);
  });

  it('getUser', () => {
    const user = getTestUser('tester-1');
    expect(getUser(user.username)).toStrictEqual(user);
  });

  it('deleteUser', () => {
    const user = getTestUser('tester-1');

    deleteUser(user.username);
    expect(users[user.username]).toBeUndefined();
  });

  it('clearUsers', () => {
    // Populate user store with some users
    for (let i = 0; i < 5; i++) {
      createUser(getTestUser(`tester-${i}`));
    }

    expect(Object.keys(users).length).toBe(5);

    clearUsers();
    expect(Object.keys(users).length).toBe(0);
  });
});
