import { Logger } from "winston";
import { PluginDatabaseManager } from "@backstage/backend-common";
import { initializePersistenceContext, PersistenceContext } from "./persistance/persistenceContext";

export type ServersContextOptions = {
    logger: Logger;
    database: PluginDatabaseManager;
}

export type ServersContext = {
    logger: Logger;
    persistanceContext: PersistenceContext;
}

export const buildServersContext = async({
    logger,
    database,
}: ServersContextOptions): Promise<ServersContext> => {
    return {
        logger: logger,
        persistanceContext: await initializePersistenceContext(database),
    }
};