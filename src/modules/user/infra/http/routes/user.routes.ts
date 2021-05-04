import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const userRoutes = Router();
const usersController = new UsersController();

// GET
userRoutes.get('/', usersController.index);
userRoutes.get('/:id', usersController.find);

// POST
userRoutes.post('/', usersController.create);

// PUT
userRoutes.put('/', ensureAuthentication, usersController.edit);

export default userRoutes;
