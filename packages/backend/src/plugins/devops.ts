import {
    buildServersContext,
    createRouter,
  } from '@internal/plugin-kafka-api-backend';
  import { Router } from 'express';

  import { PluginEnvironment } from '../types';
  
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