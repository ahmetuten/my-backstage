import {
    PluginDatabaseManager,
    resolvePackagePath,
  } from '@backstage/backend-common';
  import { ServersDatabase } from './ServersDatabase';
import { KafkasDatabase } from './KafkaDatabase';
import { Logger } from 'winston';
  
  const migrationsDir = resolvePackagePath(
    '@internal/plugin-inventory-backend',
    'migrations',
  );
  
  /**
   * A Container for persistence related components in Announcements
   *
   * @public
   */
  export type PersistenceContext = {
    serverStore: ServersDatabase;
    kafkaStore: KafkasDatabase;
  };
  
  /**
   * A factory method to construct persistence context.
   *
   * @public
   */
  export const initializePersistenceContext = async (
    database: PluginDatabaseManager, logger: Logger
  ): Promise<PersistenceContext> => {
    const client = await database.getClient();
  
    if (!database.migrations?.skip) {
      logger.info(`DB migration for invnetory backend: ${  migrationsDir}`)
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }
  
    return {
      serverStore: new ServersDatabase(client),
      kafkaStore: new KafkasDatabase(client),
    };
  };