import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => { // endpoint olusturuluyor
    logger.info('PONG!');
    response.json({ status: 'ok' }); // dönecek olan response
  });
  router.use(errorHandler());
  return router;
}
