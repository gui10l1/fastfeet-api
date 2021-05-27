import { sign } from 'jsonwebtoken';

import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';

import VerifySessionsService from './VerifySessionsService';

let verifySessionsService: VerifySessionsService;

describe('VerifySessions', () => {
  beforeEach(() => {
    verifySessionsService = new VerifySessionsService();
  });

  it('should be able to verify if a sessions are valid', async () => {
    const token = sign({}, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const validToken = await verifySessionsService.execute({
      token,
    });

    expect(token).toBe(validToken);
  });

  it('should be able to verify if a sessions are invalid', async () => {
    await expect(
      verifySessionsService.execute({
        token: 'invalid-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
