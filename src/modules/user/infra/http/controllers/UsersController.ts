import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUsersService from '@modules/user/services/users/CreateUsersService';
import FindUsersService from '@modules/user/services/users/FindUsersService';
import ListUsersService from '@modules/user/services/users/ListUsersService';
import UpdateUsersService from '@modules/user/services/users/UpdateUsersService';
import DeleteUsersService from '@modules/user/services/users/DeleteUsersService';

export default class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const service = container.resolve(ListUsersService);

    const users = await service.execute();

    const response = classToClass(users);

    return res.json(response);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, cpf, email, password, adminId, deliveryMan } = req.body;

    const service = container.resolve(CreateUsersService);

    const user = await service.execute({
      adminId,
      data: {
        name,
        cpf,
        email,
        password,
        deliveryMan,
      },
    });

    const response = classToClass(user);

    return res.status(201).json(response);
  }

  public async find(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const service = container.resolve(FindUsersService);

    const user = await service.execute({
      userId: id,
    });

    const response = classToClass(user);

    return res.json(response);
  }

  public async edit(req: Request, res: Response): Promise<Response> {
    const { name, cpf, email, password, oldPassword } = req.body;
    const { id } = req.params;
    const { id: userLogged } = req.user;

    const service = container.resolve(UpdateUsersService);

    const user = await service.execute({
      userToBeUpdated: id,
      userLogged,
      data: {
        name,
        cpf,
        email,
        password,
        oldPassword,
      },
    });

    const response = classToClass(user);

    return res.json(response);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id: userLogged } = req.user;
    const { id: userToDelete } = req.params;

    const service = container.resolve(DeleteUsersService);

    await service.execute({
      userLogged,
      userToDelete,
    });

    return res.status(204).send();
  }
}
