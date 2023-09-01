import { errorHandler } from '@backstage/backend-common';
import express, { response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Kafka } from 'kafkajs';
import { Knex } from 'knex';

const kafkaTable = 'kafka_table';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());
  
  // create topic function
  const addKafkaTopic = async (
    topicName: string, 
    topicIp: string, 
    topicPort: string
    ) => {
    console.log(`ip: ${topicIp} port: ${topicPort} topic ${topicName}`);

    const kafka = new Kafka ({
      clientId: 'mycliend',
      brokers: [`${topicIp}:${topicPort}`]
    });

    const admin = kafka.admin();
    await admin.connect();

    admin.createTopics({
      topics: [{
        topic: topicName,
        numPartitions: 1,
        replicationFactor: 1
      }]
    });

    return await admin.disconnect();
  };

  router.get('/health', async (_req, _res) => {
    logger.info('PONG!');
    console.log('ALIVEEEE')

  });

  router.post('/postkafka', async(req, res) => {
    console.log('add called!');
    await addKafkaTopic(
      req.body.topicName, 
      req.body.topicIp, 
      req.body.topicPort
      );
    console.log('func worked!')
    return res.end();
  })

  router.use(errorHandler());
  return router;
}
