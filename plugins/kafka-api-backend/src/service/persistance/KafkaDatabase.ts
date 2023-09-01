import { Knex } from 'knex'; // SQL Query Builder

const kafkaTable = 'kafka_table'; // SQL Table we created at PSQL

// Type definitions
type KafkaUpsert = { // Allows reading data from and writing data into Kafka topics
    id: string;
    name: string;
    ip: string;
    port: string;
};

export type DbKafka = { // Kafkas' DB
    id: string;
    name: string;
    ip: string;
    port: string;
};

export type DbKafkaWithCategory = DbKafka & { // Same as above, with category
    category_slug?: string;
    category_title?: string;
};

export type KafkaModel = { // Skeleton for Kafka
    id: string
    name: string
    zookeeperNodes: string
    brokers: string
    version: string
    adminUrl: string
    adminUser: string
    adminPassword: string
};

export type KafkaTopicModel = { // Skeleton for topic
    name: string
};

type KafkasFilters = { // To customize result page (?)
    max?: number; 
    offset?: number;
};

type KafkasList = { // A list of Kafkas
    count: number;
    results: KafkaModel[];
};


// Function definitions

const kafkaUpsertToDB = (
    kafka: KafkaUpsert,
): DbKafka => {
    return {
        id: kafka.id,
        name: kafka.name,
        ip: kafka.ip,
        port: kafka.port,
    } 
};

const DBToKafkaWithCategory = (
    kafkaDb: DbKafkaWithCategory,
): KafkaModel => {
    return {
        id: kafkaDb.id,
        name: kafkaDb.name,
        ip: kafkaDb.ip,
        port: kafkaDb.port,
    }
};

// Class definition

export class KafkasDatabase {
    constructor(private readonly db: Knex) {}

    async kafkas (
        request: KafkasFilters,
    ): Promise<KafkasList> {
        
    // Counts how many rows are there in the table by counting 'id'
    const countQueryBuilder = this.db<DbKafka>(kafkaTable).count<Record<string, number>>('id', {as: 'total'});
    
    // Gets the result
    const countResult = await countQueryBuilder.first();

    const queryBuilder = this.db<DbKafkaWithCategory>(kafkaTable).select(
        'id',
        'name',
        'ip',
        'port',
    ).orderBy('id', 'desc');

    // If given, sets offset
    if (request.offset) {
        queryBuilder.offset(request.offset);
    };
    
    // If given, sets results a limit
    if (request.max) {
        queryBuilder.limit(request.max);
    };

    return {
        // If counting is not successful, count is 0.
        count: countResult && countResult.total ? countResult.total : 0,
        results: (await queryBuilder.select()).map(DBToKafkaWithCategory)
        };
    };

    // Gets Kafka by ID
    async kafkaByID(id: string): Promise<KafkaModel | undefined> {
        const dbKafka = await this.db<DbKafkaWithCategory>(
        kafkaTable,
        )
        .select(
            'id',
            'name',
            'ip',
            'port',
        )
        .where('id', id)
        .first();
        if (!dbKafka) {
        return undefined;
        }
    
        return DBToKafkaWithCategory(dbKafka);
    };

    // Deletes Kafka
    async deleteKafka(id: string): Promise<void> {
        return this.db<DbKafka>(kafkaTable).where('id', id).delete();
    };

    // Adds specified Kafka to DB
    async insertKafka(
        kafka: KafkaUpsert,
    ): Promise<KafkaModel> {
        await this.db<DbKafka>(kafkaTable).insert(
        kafkaUpsertToDB(kafka),
        );
    
        return (await this.kafkaByID(kafka.id))!;
    };

    // Updates specified Kafka's info
    async updateKafka(
        kafka: KafkaUpsert,
    ): Promise<KafkaModel> {
        await this.db<DbKafka>(kafkaTable)
        .where('id', kafka.id)
        .update(kafkaUpsertToDB(kafka));
    
        return (await this.kafkaByID(kafka.id))!;
    };
}