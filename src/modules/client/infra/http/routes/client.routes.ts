import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthentication from '@modules/user/infra/http/middlewares/ensureAuthentication';

import ClientsController from '../controllers/ClientsController';

const clientRoutes = Router();
const clientsController = new ClientsController();

// GET
clientRoutes.get('/', ensureAuthentication, clientsController.find);

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
