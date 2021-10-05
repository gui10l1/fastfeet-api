import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/uploadConfig';

import Middlewares from '@shared/infra/http/middlewares/Middlewares';

import AcceptDeliveriesController from '../controllers/deliverymen/AcceptDeliveriesController';
import DeliveryMenController from '../controllers/deliverymen/DeliveryMenController';
import FinishDeliveriesController from '../controllers/deliverymen/FinishDeliveriesController';
import FinishedDeliveriesController from '../controllers/deliverymen/FinishedDeliveriesController';
import WithdrawDeliveriesController from '../controllers/deliverymen/WithdrawDeliveriesController';

const deliveryManRoutes = Router();

const upload = multer(uploadConfig.config.multer);

const deliveryManController = new DeliveryMenController();
const finishedDeliveriesController = new FinishedDeliveriesController();
const finishDeliveriesController = new FinishDeliveriesController();
const withdrawDeliveriesService = new WithdrawDeliveriesController();
const acceptDeliveriesController = new AcceptDeliveriesController();
const { ensureAuthentication } = new Middlewares();

deliveryManRoutes.use(ensureAuthentication);

deliveryManRoutes.get(
  '/me/deliveries',
  celebrate({
    [Segments.QUERY]: {
      relations: Joi.array().items(Joi.string().valid('product')).max(1),
    },
  }),
  deliveryManController.index,
);
deliveryManRoutes.get(
  '/me/finished-deliveries',
  celebrate({
    [Segments.QUERY]: {
      relations: Joi.array().items(Joi.string().valid('product')).max(1),
    },
  }),
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
