import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/uploadConfig';
import ensureAuthentication from '@modules/user/infra/http/middlewares/ensureAuthentication';

import { celebrate, Joi, Segments } from 'celebrate';
import AcceptDeliveriesController from '../controllers/deliverymen/AcceptDeliveriesController';
import DeliveryMenController from '../controllers/deliverymen/DeliveryMenController';
import FinishDeliveriesController from '../controllers/deliverymen/FinishDeliveriesController';
import WithdrawDeliveriesController from '../controllers/deliverymen/WithdrawDeliveriesController';
import FinishedDeliveriesController from '../controllers/deliverymen/FinishedDeliveriesController';

const deliveryManRoutes = Router();

const upload = multer(uploadConfig.config.multer);

const deliveryManController = new DeliveryMenController();
const finishedDeliveriesController = new FinishedDeliveriesController();
const finishDeliveriesController = new FinishDeliveriesController();
const withdrawDeliveriesService = new WithdrawDeliveriesController();
const acceptDeliveriesController = new AcceptDeliveriesController();

deliveryManRoutes.use(ensureAuthentication);

deliveryManRoutes.get('/me/deliveries', deliveryManController.index);
deliveryManRoutes.get(
  '/me/finished-deliveries',
  finishedDeliveriesController.index,
);

deliveryManRoutes.patch(
  '/deliveries/:deliveryId/finish',
  celebrate({
    [Segments.PARAMS]: { deliveryId: Joi.string().uuid().required() },
  }),
  upload.single('signature-photo'),
  finishDeliveriesController.index,
);
deliveryManRoutes.patch(
  '/deliveries/:deliveryId/withdraw',
  celebrate({
    [Segments.PARAMS]: { deliveryId: Joi.string().uuid().required() },
  }),
  withdrawDeliveriesService.index,
);
deliveryManRoutes.patch(
  '/delivery/:deliveryId/accept',
  celebrate({
    [Segments.PARAMS]: { deliveryId: Joi.string().uuid().required() },
  }),
  acceptDeliveriesController.index,
);

export default deliveryManRoutes;
