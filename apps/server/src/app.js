import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';
import { initializeAgentEcosystem } from './ai/agents/index.js';
import './models/index.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { sanitizeNoSql } from './middleware/sanitize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDistPath = path.resolve(__dirname, '../../web/dist');

const app = express();
// Initialize the 21 AI agents ecosystem registry
initializeAgentEcosystem();
// 1. Trust Proxy (for accurate rate-limiting through reverse proxies)
app.set('trust proxy', 1);
// 2. HTTP Security Headers
app.use(helmet({ contentSecurityPolicy: false }));
// 3. CORS configuration
const configuredOrigins = env.CLIENT_URL
    ? env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/+$/, ''))
    : ['http://localhost:5173'];

const isOriginAllowed = (origin) => {
    if (!origin) return true; // Direct API calls, postman, mobile apps, or server-to-server
    const cleanOrigin = origin.replace(/\/+$/, '');

    // Check configured origins or wildcard
    if (configuredOrigins.includes('*') || configuredOrigins.includes(cleanOrigin)) {
        return true;
    }

    // Auto-allow all Vercel domains (e.g., https://xxx.vercel.app, preview branches)
    if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app')) {
        return true;
    }

    // Auto-allow all Render domains (e.g., https://xxx.onrender.com)
    if (/^https:\/\/[a-zA-Z0-9_-]+\.onrender\.com$/.test(cleanOrigin) ||
        cleanOrigin.endsWith('.onrender.com')) {
        return true;
    }

    // Auto-allow Cloudflare Pages / Netlify / Railway
    if (cleanOrigin.endsWith('.pages.dev') ||
        cleanOrigin.endsWith('.netlify.app') ||
        cleanOrigin.endsWith('.up.railway.app')) {
        return true;
    }

    // Auto-allow localhost on any port
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
        return true;
    }

    return false;
};

const corsOptions = {
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }
        logger.warn(`⚠️ CORS blocked request from origin: ${origin}`);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-request-id',
        'x-refresh-token',
        'x-seed-key',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
    exposedHeaders: ['x-request-id'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// 4. Content compression
app.use(compression());
// 5. Request Parsers & Sanitization
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false, limit: '256kb' }));
app.use(sanitizeNoSql);
app.use(cookieParser());
// 6. Request ID middleware for tracing
app.use((req, res, next) => {
    const requestId = uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);
    next();
});
// 7. Request logging combined with Winston
const morganFormat = env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));
// 8. Health Check Endpoint
app.get('/api/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(200).json({
        success: true,
        data: {
            status: 'OK',
            database: isDbConnected ? 'connected' : 'connecting',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        },
    });
});

// 8.5 Safe Database Seed Endpoint
app.all('/api/v1/system/seed', async (req, res, next) => {
    try {
        const secret = req.query.key || req.headers['x-seed-key'];
        const adminCount = await User.countDocuments({ role: 'ADMIN' });
        const userCount = await User.countDocuments();

        if (env.NODE_ENV === 'production') {
            const isAuthorized = secret === env.JWT_SECRET || process.env.ALLOW_SEED_IN_PRODUCTION === 'true' || process.env.AUTO_SEED === 'true' || userCount === 0;
            if (!isAuthorized) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. In production, pass ?key=<JWT_SECRET> or header x-seed-key to initialize/seed database.',
                });
            }
        } else {
            if (adminCount > 0 && secret !== env.JWT_SECRET) {
                return res.status(403).json({
                    success: false,
                    message: 'Admin account already exists. Pass ?key=<JWT_SECRET> to re-seed.',
                });
            }
        }
        await seedDatabase();
        res.status(200).json({
            success: true,
            message: 'Core credentials successfully seeded (Admin, Faculty, Placement Officer, Student).',
        });
    } catch (err) {
        next(err);
    }
});

// 9. API Routes & Rate Limiting with DB readiness guard
app.use('/api/v1', (req, res, next) => {
    if (req.path === '/system/seed') return next();
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            error: {
                message: 'Database connection in progress or unavailable. On Render, please ensure MONGODB_URI is set and MongoDB Atlas Network Access allows 0.0.0.0/0.',
                code: 'DATABASE_UNAVAILABLE',
            },
        });
    }
    next();
}, apiLimiter, apiRoutes);

// 10. Static Frontend SPA Serving (Full-Stack Support with caching headers)
if (fs.existsSync(webDistPath)) {
    app.use(express.static(webDistPath, {
        maxAge: '1d',
        etag: true,
    }));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(webDistPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.status(200).json({
            name: 'CampusGent AI API Server',
            status: 'online',
            version: '1.0.0',
            endpoints: {
                health: '/api/health',
                api: '/api/v1',
            },
        });
    });
}

// 11. Centralized Error Handler (Must be registered last)
app.use(errorHandler);
export default app;
