import ensureAuthentication from '@modules/user/infra/http/middlewares/ensureAuthentication';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import CancelDeliveriesController from '../controllers/deliveries/CancelDeliveriesController';
import DeliveriesController from '../controllers/deliveries/DeliveriesController';

const deliveryRoutes = Router();
const deliveriesController = new DeliveriesController();
const cancelDeliveriesController = new CancelDeliveriesController();

deliveryRoutes.use(ensureAuthentication);

deliveryRoutes.get(
  '/cancel/:deliveryId',
  celebrate({
    [Segments.PARAMS]: { deliveryId: Joi.string().uuid().required() },
  }),
  cancelDeliveriesController.index,
);

deliveryRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      postalCode: Joi.string().required(),
      product: Joi.string().required(),
      address: Joi.string().required(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    },
  }),
  deliveriesController.create,
);

export default deliveryRoutes;
