import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

import { getUser, createUser, deleteUser } from '../store/users';
import logger from '../utils/logger';

const loginRoute = (req: Request, res: Response): void => {
  // Give each login request unique id so it can be tracked
  const requestId = uuidv4();
  logger.info(`[${requestId}][${req.body.username}] incoming login request`);

  if (!req.body.username) {
    logger.info(
      `[${requestId}] no username provided, responding with status 400`
    );

    res.status(400);
    res.json({
      error: { message: 'Please specify a username' },
    });

    return;
  }

  if (req.body.username.length < 3) {
    logger.info(
      `[${requestId}][${req.body.username}] invalid username, responding with status 400`
    );

    res.status(400);
    res.json({
      error: { message: 'Username must be at least 3 characters long' },
    });

    return;
  }

  logger.debug(`[${requestId}][${req.body.username}] looking for user`);
  const user = getUser(req.body.username);

  if (!user) {
    logger.debug(
      `[${requestId}][${req.body.username}] user not found, creating...`
    );
    createUser({
      username: req.body.username,
      token: uuidv4(),
      socketId: null,
      // If user doesn't connect to ws in 5s delete the user entry
      inactivityTimeout: setTimeout(() => {
        deleteUser(req.body.username);
      }, 5000),
    });

    const { username, token } = getUser(req.body.username);

    res.json({ username, token });
    logger.info(`[${requestId}][${username}] logged in`);

    return;
  }

  logger.info(
    `[${requestId}][${req.body.username}] username already taken, responding with status 401`
  );

  res.status(401);
  res.json({ error: { message: 'Username already taken.' } });
};

export default loginRoute;
