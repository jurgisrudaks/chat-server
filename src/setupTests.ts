import { transports } from 'winston';

import logger from './utils/logger';

// Disable all logging during tests
// Note: we have to have at least one transport
// so winston doesnn't throw an error
logger.clear();
logger.add(
  new transports.Console({
    silent: true,
  })
);
