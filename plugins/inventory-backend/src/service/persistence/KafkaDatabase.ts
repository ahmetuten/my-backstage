import { Knex } from 'knex';
import { KafkaModel } from '@internal/plugin-kafka-api-backend/src/service/persistance/KafkaDatabase';

const kafkaTable = 't_kafkas';

type KafkaUpsert = {
  id: string;
  name: string;
  zookeeperNodes: string;
  brokers: string;
  version: string;
  adminUrl: string;
  adminUser: string;
  adminPassword: string;
};

export type DbKafka = {
    id: string;
    name: string;
    zookeeperNodes: string;
    brokers: string;
    version: string;
    adminUrl: string;
    adminUser: string;
    adminPassword: string;
};

export type DbKafkaWithCategory = DbKafka & {
  category_slug?: string;
  category_title?: string;
};

type KafkasFilters = {
  max?: number;
  offset?: number;
};

type KafkasList = {
  count: number;
  results: KafkaModel[];
};


const kafkaUpsertToDB = (
  kafka: KafkaUpsert,
): DbKafka => {
  return {
    id: kafka.id,
    name: kafka.name,
    zookeeperNodes: kafka.zookeeperNodes,
    brokers: kafka.brokers,
    version: kafka.version,
    adminUrl: kafka.adminUrl,
    adminUser: kafka.adminUser,
    adminPassword: kafka.adminPassword,
  };
};

const DBToKafkaWithCategory = (
  kafkaDb: DbKafkaWithCategory,
): KafkaModel => {
  return {
    id: kafkaDb.id,
    name: kafkaDb.name,
    zookeeperNodes: kafkaDb.zookeeperNodes,
    brokers: kafkaDb.brokers,
    version: kafkaDb.version,
    adminUrl: kafkaDb.adminUrl,
    adminUser: kafkaDb.adminUser,
    adminPassword: kafkaDb.adminPassword,
  };
};

export class KafkasDatabase {
  constructor(private readonly db: Knex) {}

  async kafkas(
    request: KafkasFilters,
  ): Promise<KafkasList> {
    const countQueryBuilder = this.db<DbKafka>(kafkaTable).count<
      Record<string, number>
    >('id', { as: 'total' });


    const countResult = await countQueryBuilder.first();

    const queryBuilder = this.db<DbKafkaWithCategory>(kafkaTable)
      .select(
        'id',
        'name',
        'zookeeperNodes',
        'brokers',
        'version',
        'adminUrl',
        'adminUser',
        'adminPassword',
      )
      .orderBy('id', 'desc');

    if (request.offset) {
      queryBuilder.offset(request.offset);
    }
    if (request.max) {
      queryBuilder.limit(request.max);
    }

    return {
      count: countResult && countResult.total ? countResult.total : 0,
      results: (await queryBuilder.select()).map(DBToKafkaWithCategory),
    };
  }

  async kafkaByID(id: string): Promise<KafkaModel | undefined> {
    const dbKafka = await this.db<DbKafkaWithCategory>(
      kafkaTable,
    )
      .select(
        'id',
        'name',
        'zookeeperNodes',
        'brokers',
        'version',
        'adminUrl',
        'adminUser',
        'adminPassword',
      )
      .where('id', id)
      .first();
    if (!dbKafka) {
      return undefined;
    }

    return DBToKafkaWithCategory(dbKafka);
  }

  async deleteKafka(id: string): Promise<void> {
    return this.db<DbKafka>(kafkaTable).where('id', id).delete();
  }

  async insertKafka(
    kafka: KafkaUpsert,
  ): Promise<KafkaModel> {
    await this.db<DbKafka>(kafkaTable).insert(
      kafkaUpsertToDB(kafka),
    );

    return (await this.kafkaByID(kafka.id))!;
  }

  async updateKafka(
    kafka: KafkaUpsert,
  ): Promise<KafkaModel> {
    await this.db<DbKafka>(kafkaTable)
      .where('id', kafka.id)
      .update(kafkaUpsertToDB(kafka));

    return (await this.kafkaByID(kafka.id))!;
  }
}