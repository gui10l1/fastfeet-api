import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionsService from '@modules/user/services/sessions/CreateSessionsService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { cpf, password } = req.body;

    const service = container.resolve(CreateSessionsService);

    const { token, userLogged } = await service.execute({
      cpf,
      password,
    });

    const userToResponse = classToClass(userLogged);

    return res.status(201).json({ token, user: userToResponse });
  }
}
