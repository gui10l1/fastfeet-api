import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  type: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  type: 'redis',
  config: {
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
  },
} as ICacheConfig;
