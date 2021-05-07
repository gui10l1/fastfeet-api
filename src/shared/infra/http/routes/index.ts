import { Router } from 'express';

import userRoutes from '@modules/user/infra/http/routes/user.routes';
import userSessionRoutes from '@modules/user/infra/http/routes/session.routes';
import clientSessionRoutes from '@modules/client/infra/http/routes/session.routes';
import clientRoutes from '@modules/client/infra/http/routes/client.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', userSessionRoutes, clientSessionRoutes);
routes.use('/clients', clientRoutes);

export default routes;
