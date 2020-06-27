import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import 'reflect-metadata';

import routes from './routes';
import uplaodConfig from './config/upload';
import AppError from './errors/AppError';
import './database';

const app = express();

app.use(express.json());

function logRequest(request: Request, response: Response, next: NextFunction) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

app.use(logRequest);
app.use('/files', express.static(uplaodConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server starded on port 3333 🚀');
});
