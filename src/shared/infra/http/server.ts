import 'reflect-metadata';
import 'dotenv';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

// Routes
import routes from './routes';

// Client errors
import AppError from '../../errors/AppError';

// Database connection
import '../database/typeorm/connection';

// Containers
import '../../containers';

const app = express();

app.use(express.json());
app.use(routes);
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.json(err.httpCode).json({ type: 'error', message: err.message });
  }

  console.error(err);

  return res.status(500).json({ message: 'Internal server error!' });
});
app.listen(3333, () => {
  console.log('Server started on port 3333 (fastfeet-api)');
});
