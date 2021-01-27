import { Request, Response, NextFunction } from 'express';

export default function logRequest(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}
