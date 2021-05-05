import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const userRoutes = Router();
const usersController = new UsersController();

// GET
userRoutes.get('/', usersController.index);
userRoutes.get(
  '/:id',
  celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }),
  usersController.find,
);

// POST
userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      cpf: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      deliveryMan: Joi.boolean(),
      adminId: Joi.string().uuid(),
    },
  }),
  usersController.create,
);

// PUT
userRoutes.put(
  '/:id',
  ensureAuthentication,
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
    [Segments.BODY]: {
      name: Joi.string(),
      cpf: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
      oldPassword: Joi.string().when(Joi.ref('password'), {
        is: Joi.exist(),
        then: Joi.string().required(),
      }),
      deliveryMan: Joi.boolean(),
    },
  }),
  usersController.edit,
);

// DELETE
userRoutes.delete(
  '/:id',
  ensureAuthentication,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete,
);

export default userRoutes;
