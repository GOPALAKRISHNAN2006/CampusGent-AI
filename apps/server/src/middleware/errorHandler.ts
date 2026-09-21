import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Structured Logging
  logger.error(
    `${req.method} ${req.originalUrl} - Error: ${err.message} - Stack: ${err.stack}`
  );

  // 1. Handled Application Errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
    return;
  }

  // 2. Zod Schema Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // 3. Fallback for Internal Uncaught Server Errors
  const responseError = {
    code: 'INTERNAL_SERVER_ERROR',
    message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  };

  res.status(500).json({
    success: false,
    error: responseError,
  });
};
