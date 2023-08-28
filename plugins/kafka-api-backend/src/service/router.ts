import { errorHandler } from '@backstage/backend-common';
import express, { response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Kafka } from 'kafkajs';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', async (req, res) => {
    logger.info('PONG!');
    
    const { topicName } = req.query; // Burada query parametresinden topic adını alıyoruz

    if (!topicName) {
      return res.status(400).json({ error: 'Missing topicName in query parameters' });
    }

    try {
      const kafka = new Kafka({
          clientId: 'kafka_pub_sub_client',
          brokers: ["192.168.1.100:9092"]
      });

      const admin = kafka.admin();
      logger.info("Broker'a bağlanılıyor...")
      await admin.connect();
      logger.info("Broker'a bağlanıldı, topic oluşturulacak...")
      await admin.createTopics({
          topics: [
              {
                  topic: `${topicName}`,
                  numPartitions: 1
              }
          ]
      })
      logger.info("topic oluşturuldu");
      response.json(({status: "ok"}))
      await admin.disconnect();
      } catch (error) {
        logger.info("bir hata oluştu", error)
      }finally {
          process.exit(0);
      }
  
  });
  router.use(errorHandler());
  return router;
}
