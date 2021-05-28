import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionRoutes = Router();
const sessionsController = new SessionsController();

sessionRoutes.post(
  '/user',
  celebrate({
    [Segments.BODY]: {
      cpf: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

sessionRoutes.post(
  '/verify',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required(),
    },
  }),
  sessionsController.index,
);

export default sessionRoutes;
