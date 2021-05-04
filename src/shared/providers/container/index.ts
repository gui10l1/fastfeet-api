import { container } from 'tsyringe';

import HashProvider from '../HashProvider/fakes/FakeHashProvider';
import IHashProvider from '../HashProvider/models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', HashProvider);
