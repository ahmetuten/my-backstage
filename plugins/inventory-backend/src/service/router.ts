import { errorHandler } from '@backstage/backend-common';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { ServersContext } from './serversContextBuilder';
import { v4 as uuid } from 'uuid';

export type KafkaInsertModel = {
  id: string;
  name: string;
  zookeeperNodes: string;
  brokers: string;
  version: string;
  adminUrl: string;
  adminUser: string;
  adminPassword: string;
};

export async function createRouter(
  options: ServersContext,
): Promise<express.Router> {
  const { logger } = options;
  const { persistenceContext } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('health');
    response.json({ status: 'ok' });
  });

  router.get(
    '/servers',
    async (req: Request<{}, {}, {}, { page?: number; max?: number }>, res) => {
      const results = await persistenceContext.serverStore.servers({
        max: req.query.max,
        offset: req.query.page
          ? (req.query.page - 1) * (req.query.max ?? 10)
          : undefined,
      });
      return res.json(results.results);
    },
  );

  router.get(
    '/kafkas',
    async (req: Request<{}, {}, {}, { page?: number; max?: number }>, res) => {
      const results = await persistenceContext.kafkaStore.kafkas({
        max: req.query.max,
        offset: req.query.page
          ? (req.query.page - 1) * (req.query.max ?? 10)
          : undefined,
      });

      return res.json(results.results);
    },
  );

  router.get(
    '/kafkas/:id',
    async (req: Request<{ id: string }, {}, {}, {}>, res) => {
      const kafkaId = req.params.id
      const kafka = await persistenceContext.kafkaStore.kafkaByID(kafkaId)
      return res.json(kafka);
    },
  );

  router.post(
    '/kafkas',
    async (req: Request<{}, {}, KafkaInsertModel, {}>, res) => {
      await persistenceContext.kafkaStore.insertKafka({
        ...req.body,
        ...{
          id: uuid(),
        },
      });

      return res.status(201).json();
    },
  );

  router.put(
    '/kafkas',
    async (req: Request<{}, {}, KafkaInsertModel, {}>, res) => {
      await persistenceContext.kafkaStore.updateKafka(req.body);

      return res.status(200).json();
    },
  );

  router.delete(
    '/kafkas/:id',
    async (req: Request<{ id: string }, {}, {}, {}>, res) => {
      await persistenceContext.kafkaStore.deleteKafka(req.params.id);

      return res.status(204).end();
    },
  );

  router.use(errorHandler());
  return router;
}
