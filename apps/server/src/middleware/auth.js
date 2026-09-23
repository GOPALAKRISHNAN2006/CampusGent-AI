import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Access token is missing or malformed', 'TOKEN_MISSING');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError('Access token has expired', 'TOKEN_EXPIRED'));
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Invalid access token', 'TOKEN_INVALID'));
        }
        else {
            next(error);
        }
    }
};
