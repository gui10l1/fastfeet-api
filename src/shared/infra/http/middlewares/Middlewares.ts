import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/authConfig';

import UsersRepository from '@modules/user/infra/database/typeorm/repositories/UsersRepository';

import AppError from '@shared/errors/AppError';

import '@shared/infra/database/typeorm/connection';

interface IPayloadToken {
  iat: string;
  sub: string;
  exp: number;
}

export default class Middlewares {
  public ensureAuthentication(
    req: Request,
    _: Response,
    next: NextFunction,
  ): void {
    const headers = req.headers.authorization;

    if (!headers) {
      throw new AppError('Authentication token is missing!');
    }

    const [, token] = headers.split(' ');

    try {
      const { sub } = verify(token, authConfig.secret) as IPayloadToken;

      req.user = {
        id: sub,
      };

      next();
    } catch (err) {
      throw new AppError('Invalid authorization token!');
    }
  }

  public async ensurePermissions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const usersRepository = new UsersRepository();

    const { id } = req.user;

    const findUser = await usersRepository.findById(id);

    if (!findUser) {
      throw new AppError('User not found!');
    }

    if (findUser.deliveryman) {
      throw new AppError('You do not have permissions to do such action!', 403);
    }

    next();
  }
}
