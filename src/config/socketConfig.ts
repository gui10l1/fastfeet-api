interface ISocketConfig {
  port: number;
  config: {
    cors: {
      origin: string | undefined;
    };
  };
}

export default {
  port: 3334,
  config: {
    cors: {
      origin: '*',
    },
  },
} as ISocketConfig;
