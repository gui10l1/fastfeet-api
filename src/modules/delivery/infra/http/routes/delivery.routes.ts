import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import Middlewares from '@shared/infra/http/middlewares/Middlewares';

import CancelDeliveriesController from '../controllers/deliveries/CancelDeliveriesController';
import DeliveriesController from '../controllers/deliveries/DeliveriesController';

const deliveryRoutes = Router();
const deliveriesController = new DeliveriesController();
const cancelDeliveriesController = new CancelDeliveriesController();
const { ensureAuthentication } = new Middlewares();

deliveryRoutes.use(ensureAuthentication);

deliveryRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      postalCode: Joi.string().required(),
      productId: Joi.string().uuid().required(),
      address: Joi.string().required(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    },
  }),
  deliveriesController.create,
);

deliveryRoutes.patch(
  '/cancel/:deliveryId',
  celebrate({
    [Segments.PARAMS]: { deliveryId: Joi.string().uuid().required() },
  }),
  cancelDeliveriesController.index,
);

export default deliveryRoutes;
