import { Router } from 'express';

import userRoutes from '@modules/user/infra/http/routes/user.routes';
import userSessionRoutes from '@modules/user/infra/http/routes/session.routes';
import clientSessionRoutes from '@modules/client/infra/http/routes/session.routes';
import clientRoutes from '@modules/client/infra/http/routes/client.routes';
import deliveryRoutes from '@modules/delivery/infra/http/routes/delivery.routes';
import deliveryManRoutes from '@modules/delivery/infra/http/routes/deliveryman.routes';
import productRoutes from '@modules/product/infra/http/routes/products.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', userSessionRoutes, clientSessionRoutes);
routes.use('/clients', clientRoutes);
routes.use('/deliveries', deliveryRoutes);
routes.use('/delivery-men', deliveryManRoutes);
routes.use('/products', productRoutes);

export default routes;
