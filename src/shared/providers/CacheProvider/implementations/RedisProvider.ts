import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cacheConfig';

import ICacheProvider from '../models/ICacheProvider';

export default class RedisProvider implements ICacheProvider {
  private redisClient: RedisClient;

  constructor() {
    this.redisClient = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  public async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const cacheResults = await this.redisClient.get(key);

    if (!cacheResults) {
      return undefined;
    }

    const parsedCacheResults = JSON.parse(cacheResults) as T;

    return parsedCacheResults;
  }
}
