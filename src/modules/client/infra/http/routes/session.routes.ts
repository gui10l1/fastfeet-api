import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionRoutes = Router();
const sessionsController = new SessionsController();

sessionRoutes.post(
  '/client',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

sessionRoutes.post(
  '/verify/client',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required(),
    },
  }),
  sessionsController.index,
);

export default sessionRoutes;
