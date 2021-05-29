import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import Middlewares from '@shared/infra/http/middlewares/Middlewares';

import ClientsController from '../controllers/ClientsController';

const clientRoutes = Router();
const clientsController = new ClientsController();
const { ensureAuthentication, ensurePermissions } = new Middlewares();

// GET
clientRoutes.get(
  '/',
  ensureAuthentication,
  ensurePermissions,
  clientsController.index,
);
clientRoutes.get(
  '/:clientId',
  ensureAuthentication,
  celebrate({
    [Segments.PARAMS]: { clientId: Joi.string().uuid().required() },
  }),
  clientsController.find,
);

// POST
clientRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      postalCode: Joi.string(),
    },
  }),
  clientsController.create,
);

// PUT
clientRoutes.put(
  '/',
  ensureAuthentication,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
      oldPassword: Joi.string().when(Joi.ref('password'), {
        is: Joi.exist(),
        then: Joi.string().required(),
      }),
      postalCode: Joi.string(),
    },
  }),
  clientsController.update,
);

export default clientRoutes;
