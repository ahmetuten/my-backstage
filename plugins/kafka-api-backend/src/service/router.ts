import { DatabaseManager, errorHandler } from '@backstage/backend-common';
import express, { response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Kafka } from 'kafkajs';
import { Knex } from 'knex';

const kafkaTable = 'kafka';

export interface RouterOptions {
  logger: Logger;
  // db, pers cont
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
      clientId: 'myclient',
      brokers: [`${topicIp}:${topicPort}`]
    });

    const admin = kafka.admin();
    await admin.connect();

    const result = await admin.createTopics({
      topics: [{
        topic: topicName,
        numPartitions: 1,
        replicationFactor: 1
      }]
    });

    console.log(result)
    return await admin.disconnect();
  };

  // type KafkaInfo = {
  //   topicName: string, topicIp: string, topicPort: string
  // }
  // class DatabaseService {
  //   constructor (private readonly db: Knex) {}

  //   async insertKafka(kafka: KafkaInfo) {
  //     await this.db(kafkaTable).insert(kafka)
  //   }
  // }

  router.get('/health', async (_req, _res) => {
    logger.info('PONG!');
    console.log('ALIVEEEE')

  });

  

  // Define DB & conn info
  const db = require("knex")({
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "1234",
      database: "kafka"
    }
  });

  router.post('/trykafka',async (req,res) => {
    try {
      const{ name, email } = req.body;
      console.log("vars taken")

      await db('trykafka').insert({ name, email });
      console.log("insert has been made")
      res.status(201).json({ message: 'Data has been added to DB.' });
    } catch (error) {
      console.error('Hata:', error);
      res.status(500).json({ error: 'Something went wrong while adding data to DB.' });
    }
  });

  router.post('/postkafka', async(req, res) => {
    const name = req.body.topicName;
    const ip = req.body.topicIp;
    const port = req.body.topicPort;
    console.log('add called!');
    try {
      await addKafkaTopic(
        name,
        ip,
        port
        );
      console.log('func worked!');
      await db('kafka_table').insert({name, ip, port});
      res.status(201).json({ message: 'Data has been added to DB.' });
      console.log("insert has been made")
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Something went wrong while adding data to DB.' });
    }
    

    return res.end();
  });

  router.use(errorHandler());
  return router;
}
