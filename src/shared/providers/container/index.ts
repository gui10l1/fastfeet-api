import { Server } from 'socket.io';
import { container } from 'tsyringe';

import cacheConfig from '@config/cacheConfig';
import mailConfig from '@config/mailConfig';
import uploadConfig from '@config/uploadConfig';

import socketServer from '@shared/infra/websockets/server';

import RedisProvider from '../CacheProvider/implementations/RedisProvider';
import ICacheProvider from '../CacheProvider/models/ICacheProvider';
import HashProvider from '../HashProvider/implementations/HashProvider';
import IHashProvider from '../HashProvider/models/IHashProvider';
import SandBoxMailProvider from '../MailProvider/implementations/SandBoxMailProvider';
import IMailProvider from '../MailProvider/models/IMailProvider';
import MailTemplateProvider from '../MailTemplateProvider/implementations/MailTemplateProvider';
import IMailTemplateProvider from '../MailTemplateProvider/models/IMailTemplateProvider';
import SocketIoProvider from '../SocketProvider/implementations/SocketIoProvider';
import ISocketProvider from '../SocketProvider/models/ISocketProvider';
import DiskStorageProvider from '../StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from '../StorageProvider/models/IStorageProvider';

const mailProviderType = {
  sandbox: SandBoxMailProvider,
};

const storageProviderType = {
  disk: DiskStorageProvider,
};

const cacheProviderType = {
  redis: RedisProvider,
};

container.registerSingleton<IHashProvider>('HashProvider', HashProvider);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  MailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(mailProviderType[mailConfig.mailProvider]),
);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  storageProviderType[uploadConfig.type],
);

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  cacheProviderType[cacheConfig.type],
);

container.registerInstance<Server>('SocketIo', socketServer);

container.registerInstance<ISocketProvider>(
  'SocketProvider',
  container.resolve(SocketIoProvider),
);
