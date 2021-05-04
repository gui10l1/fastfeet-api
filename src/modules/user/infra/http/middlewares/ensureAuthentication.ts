import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/authConfig';

interface IPayloadToken {
  iat: string;
  sub: string;
  exp: number;
}

export default function ensureAuthentication(
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
    const { sub } = verify(authConfig.secret, token) as IPayloadToken;

    req.user = {
      id: sub,
    };

    next();
  } catch {
    throw new AppError('Invalid authorization token!');
  }
}
