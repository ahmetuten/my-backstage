import {
    createRouter,
  } from '@internal/plugin-kafka-api-backend';
  import { Router } from 'express';

  import { PluginEnvironment } from '../types';
import { buildServersContext } from '@internal/plugin-kafka-api-backend/src/service/serversContextBuilder';
  
  export default async function createPlugin({
    logger,
    database,
  }: PluginEnvironment): Promise<Router> {
    const announcementsContext = await buildServersContext({
      logger: logger,
      database: database,
    });
  
    return await createRouter(announcementsContext);
  }