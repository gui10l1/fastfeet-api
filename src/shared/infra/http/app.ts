import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import uploadConfig from '@config/uploadConfig';

// Client errors
import AppError from '../../errors/AppError';

// Database connection
import '../database/typeorm/connection';

// Containers
import '../../containers';

// Routes
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);
app.use(errors());
app.use('/files', express.static(uploadConfig.config.multer.uploadDirectory));
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.httpCode)
      .json({ type: 'error', message: err.message });
  }

  console.error(err);

  return res.status(500).json({ message: 'Internal server error!' });
});

export default app;