import { verify } from 'jsonwebtoken';
import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';

interface IRequest {
  token: string;
}

export default class VerifySessionsService {
  public async execute({ token }: IRequest): Promise<string> {
    try {
      verify(token, authConfig.secret);
    } catch {
      throw new AppError('Invalid token!');
    }

    return token;
  }
}
