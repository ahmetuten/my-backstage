import { Knex } from 'knex';
import { ServerModel } from '@internal/data';

const serversTable = 't_servers';

type ServerUpsert = {
  id: string;
  name: string;
  operatingSystem: string;
  cpu: string;
  tags: string;
};

export type DbServer = {
    id: string;
    name: string;
    operatingSystem: string;
    cpu: string;
    tags: string;
};

export type DbServerWithCategory = DbServer & {
  category_slug?: string;
  category_title?: string;
};

type ServersFilters = {
  max?: number;
  offset?: number;
};

type ServersList = {
  count: number;
  results: ServerModel[];
};


const serverUpsertToDB = (
  server: ServerUpsert,
): DbServer => {
  return {
    id: server.id,
    name: server.name,
    operatingSystem: server.operatingSystem,
    cpu: server.cpu,
    tags: server.tags,
  };
};

const DBToServerWithCategory = (
  serverDb: DbServerWithCategory,
): ServerModel => {
  return {
    id: serverDb.id,
    name: serverDb.name,
    operatingSystem: serverDb.operatingSystem,
    cpu: serverDb.cpu,
    tags: serverDb.tags.split(","),
  };
};

export class ServersDatabase {
  constructor(private readonly db: Knex) {}

  async servers(
    request: ServersFilters,
  ): Promise<ServersList> {
    const countQueryBuilder = this.db<DbServer>(serversTable).count<
      Record<string, number>
    >('id', { as: 'total' });


    const countResult = await countQueryBuilder.first();

    const queryBuilder = this.db<DbServerWithCategory>(serversTable)
      .select(
        'id',
        'name',
        'operatingSystem',
        'cpu',
        'tags',
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
      results: (await queryBuilder.select()).map(DBToServerWithCategory),
    };
  }

  async serverByID(id: string): Promise<ServerModel | undefined> {
    const dbServer = await this.db<DbServerWithCategory>(
      serversTable,
    )
      .select(
        'id',
        'name',
        'operatingSystem',
        'cpu',
        'tags',
      )
      .where('id', id)
      .first();
    if (!dbServer) {
      return undefined;
    }

    return DBToServerWithCategory(dbServer);
  }

  async deleteServerByID(id: string): Promise<void> {
    return this.db<DbServer>(serversTable).where('id', id).delete();
  }

  async insertServer(
    server: ServerUpsert,
  ): Promise<ServerModel> {
    await this.db<DbServer>(serversTable).insert(
      serverUpsertToDB(server),
    );

    return (await this.serverByID(server.id))!;
  }

  async updateServer(
    server: ServerUpsert,
  ): Promise<ServerModel> {
    await this.db<DbServer>(serversTable)
      .where('id', server.id)
      .update(serverUpsertToDB(server));

    return (await this.serverByID(server.id))!;
  }
}