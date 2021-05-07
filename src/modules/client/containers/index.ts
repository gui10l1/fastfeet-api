import { container } from 'tsyringe';

import ClientsRepository from '../infra/database/typeorm/repositories/ClientsRepository';
import IClientsRepository from '../repositories/IClientsRepository';

container.registerSingleton<IClientsRepository>(
  'ClientsRepository',
  ClientsRepository,
);
