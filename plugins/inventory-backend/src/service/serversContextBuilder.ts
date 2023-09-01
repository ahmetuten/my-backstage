import { Logger } from 'winston';
import { PluginDatabaseManager } from '@backstage/backend-common';
import {
  initializePersistenceContext,
  PersistenceContext,
} from './persistence/persistenceContext';

export type ServersContextOptions = {
  logger: Logger;
  database: PluginDatabaseManager;
};

export type ServersContext = {
  logger: Logger;
  persistenceContext: PersistenceContext;
};

export const buildServersContext = async ({
  logger,
  database,
}: ServersContextOptions): Promise<ServersContext> => {
  return {
    logger: logger,
    persistenceContext: await initializePersistenceContext(database, logger),
  };
};