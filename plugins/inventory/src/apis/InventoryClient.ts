
import { KafkaModel, KafkaTopicModel, ServerModel } from '@internal/plugin-kafka-api-backend/src/service/persistance/KafkaDatabase';
import { createApiRef } from '@backstage/core-plugin-api';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export interface InventoryApi {
    getServers(): Promise<ServerModel[]>;
    getKafkas(): Promise<KafkaModel[]>;
    getKafka(model: KafkaModel): Promise<KafkaModel>;
    addKafka(model: KafkaModel): Promise<void>;
    updateKafka(model: KafkaModel): Promise<void>;
    deleteKafka(id: string): Promise<void>;

    getKafkaTopics(kafka: KafkaModel): Promise<KafkaTopicModel[]>;
    deleteKafkaTopic(kafka: KafkaModel, topicName: string): Promise<void>;
    addKafkaTopic(kafka: KafkaModel, topicName: string): Promise<void>;
}

export const inventoryApiRef = createApiRef<InventoryApi>({
    id: 'plugin.inventory',
});

export class InventoryClient implements InventoryApi {
    constructor(private discovery: DiscoveryApi, private fetchApi: FetchApi) {}
    
    private async doRequest(
    path: string,
    init?: RequestInit,
    backend?: string,
    ): Promise<any> {
    const fetchInit = init ?? {};
    fetchInit.headers = fetchInit.headers || {};
    const backendPlugin = backend ?? 'inventory';

    if (fetchInit.method !== 'GET' && fetchInit.body) {
        fetchInit.headers = {
        ...fetchInit.headers,
        'Content-Type': 'application/json',
        };
    }

      const baseUrl = await this.discovery.getBaseUrl(backendPlugin);
      const response = await this.fetchApi.fetch(`${baseUrl}/${path}`, fetchInit);
      
  
      try {
        return await response.json();
      } catch (e) {
        return '';
      }
    }
  
    async getServers(): Promise<ServerModel[]> {
      const servers = await this.doRequest('servers');
      return servers;
    }
  
    async getKafkas(): Promise<KafkaModel[]> {
      const kafkaList = await this.doRequest('kafkas');
      return kafkaList;
    }
  
    async getKafkaTopics(kafkaModel: KafkaModel): Promise<KafkaTopicModel[]> {
      const request = {
        kafkaModel: kafkaModel,
        kafkaTopicModel: {},
        operation: "LIST",
      };
  
      const kafkaTopicList = await this.doRequest(
        'kafka',
        {
          method: 'POST',
          body: JSON.stringify(request),
        },
        'devops-operations',
      );
  
      return kafkaTopicList;
    }
  
    async deleteKafkaTopic(
      kafkaModel: KafkaModel,
      topicName: string,
    ): Promise<void> {
      const request = {
        kafkaModel: kafkaModel,
        kafkaTopicModel: {
          name: topicName,
        },
        operation: "DELETE",
      };
  
      return await this.doRequest(
        'kafka',
        {
          method: 'POST',
          body: JSON.stringify(request),
        },
        'devops-operations',
      );
    }
  
    async addKafkaTopic(
      kafkaModel: KafkaModel,
      topicName: string,
    ): Promise<void> {
      const request = {
        kafkaModel: kafkaModel,
        kafkaTopicModel: {
          name: topicName,
        },
        operation: "INSERT",
      };
  
      return await this.doRequest(
        'kafka',
        {
          method: 'POST',
          body: JSON.stringify(request),
        },
        'devops-operations',
      );
    }
  
    async getKafka(model: KafkaModel): Promise<KafkaModel> {
      return await this.doRequest('kafkas', {
        method: 'POST',
        body: JSON.stringify(model),
      });
    }
  
    async addKafka(model: KafkaModel): Promise<void> {
      await this.doRequest('kafkas', {
        method: 'POST',
        body: JSON.stringify(model),
      });
    }
  
    async updateKafka(model: KafkaModel): Promise<void> {
      await this.doRequest('kafkas', {
        method: 'PUT',
        body: JSON.stringify(model),
      });
    }
  
    async deleteKafka(id: string): Promise<void> {
      await this.doRequest(`kafkas/${id}`, {
        method: 'DELETE',
      });
    }
  }
  