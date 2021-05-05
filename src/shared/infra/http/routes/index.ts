import { Router } from 'express';

import userRoutes from '@modules/user/infra/http/routes/user.routes';
import sessionRoutes from '@modules/user/infra/http/routes/session.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', sessionRoutes);

export default routes;
