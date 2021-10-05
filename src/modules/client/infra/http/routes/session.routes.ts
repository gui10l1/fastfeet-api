import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

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

export default sessionRoutes;
