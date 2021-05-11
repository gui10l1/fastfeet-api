import { container } from 'tsyringe';

import mailConfig from '@config/mailConfig';
import uploadConfig from '@config/uploadConfig';

import HashProvider from '../HashProvider/implementations/HashProvider';
import IHashProvider from '../HashProvider/models/IHashProvider';

import SandBoxMailProvider from '../MailProvider/implementations/SandBoxMailProvider';
import IMailProvider from '../MailProvider/models/IMailProvider';

import MailTemplateProvider from '../MailTemplateProvider/implementations/MailTemplateProvider';
import IMailTemplateProvider from '../MailTemplateProvider/models/IMailTemplateProvider';

import DiskStorageProvider from '../StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from '../StorageProvider/models/IStorageProvider';

const mailProviderType = {
  sandbox: SandBoxMailProvider,
};

const storageProviderType = {
  disk: DiskStorageProvider,
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
