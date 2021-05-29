import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateClientsService from '@modules/client/services/clients/CreateClientsService';
import UpdateClientsService from '@modules/client/services/clients/UpdateClientsService';
import FindClientsService from '@modules/client/services/clients/FindClientsService';
import ListClientsService from '@modules/client/services/clients/ListClientsService';

export default class ClientsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const service = container.resolve(ListClientsService);

    const clients = await service.execute();

    const response = classToClass(clients);

    return res.json(response);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, postalCode } = req.body;

    const service = container.resolve(CreateClientsService);

    const client = await service.execute({
      email,
      password,
      postalCode,
      name,
    });

    const response = classToClass(client);

    return res.status(201).json(response);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, password, postalCode } = req.body;
    const { id: clientLogged } = req.user;

    const service = container.resolve(UpdateClientsService);

    const client = await service.execute({
      clientLogged,
      data: {
        email,
        password,
        postalCode,
        name,
      },
    });

    const response = classToClass(client);

    return res.status(200).json(response);
  }

  public async find(req: Request, res: Response): Promise<Response> {
    const { clientId } = req.params;

    const service = container.resolve(FindClientsService);

    const client = await service.execute({
      clientId,
    });

    const response = classToClass(client);

    return res.json(response);
  }
}
