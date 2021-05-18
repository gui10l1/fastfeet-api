import { Router } from 'express';
import multer from 'multer';

import Middlewares from '@shared/infra/http/middlewares/Middlewares';
import uploadConfig from '@config/uploadConfig';

import { celebrate, Joi, Segments } from 'celebrate';
import ProductsController from '../controllers/ProductsController';
import ProductQuantitiesController from '../controllers/ProductQuantitiesController';
import ProductPhotosController from '../controllers/ProductPhotosController';

const productRoutes = Router();
const upload = multer(uploadConfig.config.multer);
const productsController = new ProductsController();
const productQuantitiesController = new ProductQuantitiesController();
const productPhotosController = new ProductPhotosController();
const { ensurePermissions, ensureAuthentication } = new Middlewares();

productRoutes.use(ensureAuthentication);

// POST
productRoutes.post(
  '/',
  ensurePermissions,
  upload.array('photos'),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      quantityInStock: Joi.number().required(),
    },
  }),
  productsController.create,
);

// PUT
productRoutes.put(
  '/:productId',
  ensurePermissions,
  celebrate({
    [Segments.PARAMS]: {
      productId: Joi.string().uuid(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      price: Joi.number(),
      description: Joi.string(),
      quantityInStock: Joi.number(),
      photos: Joi.array(),
    },
  }),
  productsController.update,
);

// PATCH
productRoutes.patch(
  '/:productId/add-photos',
  upload.array('photos'),
  ensurePermissions,
  celebrate({
    [Segments.PARAMS]: {
      productId: Joi.string().uuid(),
    },
    [Segments.BODY]: {
      productId: Joi.string().uuid(),
    },
  }),
  productPhotosController.create,
);
productRoutes.patch(
  '/:productId/add-quantity',
  ensurePermissions,
  celebrate({
    [Segments.PARAMS]: {
      productId: Joi.string().uuid(),
    },
    [Segments.BODY]: {
      quantity: Joi.number().required(),
    },
  }),
  productQuantitiesController.create,
);
productRoutes.patch(
  '/:productId/remove-photos',
  ensurePermissions,
  celebrate({
    [Segments.PARAMS]: {
      productId: Joi.string().uuid(),
    },
    [Segments.BODY]: {
      photos: Joi.array().required(),
    },
  }),
  productPhotosController.update,
);
productRoutes.patch(
  '/:productId/remove-quantity',
  ensurePermissions,
  celebrate({
    [Segments.PARAMS]: {
      productId: Joi.string().uuid(),
    },
    [Segments.BODY]: {
      quantity: Joi.number().required(),
    },
  }),
  productQuantitiesController.update,
);

export default productRoutes;
