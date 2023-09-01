import {
    PluginDatabaseManager,
    resolvePackagePath,
} from '@backstage/backend-common';
import { KafkasDatabase } from './KafkaDatabase';

const migrationsDir = resolvePackagePath(
    '@internal/plugin-kafka-api-backend',
    'migrations',
);

/**
    @public
   */
export type PersistenceContext = {
    kafkasStore: KafkasDatabase;
};

export const initializePersistenceContext = async (
    database: PluginDatabaseManager,
): Promise<PersistenceContext> => {
    const client = await database.getClient();
    if (!database.migrations?.skip) {
    await client.migrate.latest({
        directory: migrationsDir,
    });
    }
    return {
    kafkasStore: new KafkasDatabase(client),
    };
};