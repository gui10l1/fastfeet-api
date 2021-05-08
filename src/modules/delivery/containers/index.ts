import { container } from 'tsyringe';

import DeliveriesRepository from '../infra/database/typeorm/repositories/DeliveriesRepository';
import IDeliveriesRepository from '../repositories/IDeliveriesRepository';

container.registerSingleton<IDeliveriesRepository>(
  'DeliveriesRepository',
  DeliveriesRepository,
);
