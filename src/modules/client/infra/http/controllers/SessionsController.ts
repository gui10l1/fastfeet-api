import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionsService from '@modules/client/services/sessions/CreateSessionsService';
import VerifySessionsService from '@modules/client/services/sessions/VerifySessionsService';

export default class SessionsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { token } = req.body;

    const service = container.resolve(VerifySessionsService);

    const tokenVerified = await service.execute({ token });

    return res.json(tokenVerified);
  }

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
