import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionsService from '@modules/client/services/sessions/CreateSessionsService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const service = container.resolve(CreateSessionsService);

    const { token, clientLogged } = await service.execute({
      email,
      password,
    });

    const userToResponse = classToClass(clientLogged);

    return res.status(201).json({ token, user: userToResponse });
  }
}
