import { Router } from 'express';

import clientRoutes from '@modules/client/infra/http/routes/client.routes';
import clientSessionRoutes from '@modules/client/infra/http/routes/session.routes';
import deliveryRoutes from '@modules/delivery/infra/http/routes/delivery.routes';
import deliveryManRoutes from '@modules/delivery/infra/http/routes/deliveryman.routes';
import productRoutes from '@modules/product/infra/http/routes/products.routes';
import userSessionRoutes from '@modules/user/infra/http/routes/session.routes';
import userRoutes from '@modules/user/infra/http/routes/user.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', userSessionRoutes, clientSessionRoutes);
routes.use('/clients', clientRoutes);
routes.use('/deliveries', deliveryRoutes);
routes.use('/delivery-men', deliveryManRoutes);
routes.use('/products', productRoutes);

export default routes;
