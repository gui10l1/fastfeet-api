import mailConfig from '@config/mailConfig';
import { container } from 'tsyringe';

import HashProvider from '../HashProvider/implementations/HashProvider';
import IHashProvider from '../HashProvider/models/IHashProvider';

import SandBoxMailProvider from '../MailProvider/implementations/SandBoxMailProvider';
import IMailProvider from '../MailProvider/models/IMailProvider';

import MailTemplateProvider from '../MailTemplateProvider/implementations/MailTemplateProvider';
import IMailTemplateProvider from '../MailTemplateProvider/models/IMailTemplateProvider';

const mailProviderType = {
  sandbox: SandBoxMailProvider,
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
