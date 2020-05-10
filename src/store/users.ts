export type User = {
  username: string;
  socketId: string | null;
  inactivityTimeout: NodeJS.Timeout | null;
  token: string;
};

export let users: { [username: string]: User } = {};

export const createUser = (newUser: User): void => {
  users[newUser.username] = { ...newUser };
};

export const getUser = (username: string): User => {
  return users[username];
};

export const deleteUser = (username: string): void => {
  delete users[username];
};

export const clearUsers = (): void => {
  users = {};
};

export default { users, createUser, getUser, deleteUser, clearUsers };
