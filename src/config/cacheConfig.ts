import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  type: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  type: process.env.CACHE_PROVIDER,
  config: {
    redis: {
      host: process.env.CACHE_PROVIDER_HOST,
      port: process.env.CACHE_PROVIDER_PORT,
      password: process.env.CACHE_PROVIDER_PASSWORD,
    },
  },
} as ICacheConfig;
