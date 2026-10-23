import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { ZodError } from 'zod';
export const errorHandler = (err, req, res, next) => {
    // Structured Logging
    logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message} - Stack: ${err.stack}`);
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
    // 2.5 Mongoose CastError (Malformed ObjectIds)
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_IDENTIFIER',
                message: `Invalid format for resource identifier '${err.path}': ${err.value}`,
            },
        });
        return;
    }
    // 2.6 Mongoose Duplicate Key Error (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'resource';
        res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_RESOURCE',
                message: `A record with this ${field} already exists in the system.`,
            },
        });
        return;
    }
    // 2.7 Mongoose Document Validation Errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: err.message,
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
