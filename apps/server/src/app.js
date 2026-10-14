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
const allowedOrigins = env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
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
    res.status(200).json({
        success: true,
        data: {
            status: 'OK',
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
        if (adminCount > 0 && secret !== env.JWT_SECRET) {
            return res.status(403).json({
                success: false,
                message: 'Admin account already exists. Pass ?key=<JWT_SECRET> to re-seed.',
            });
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

// 9. API Routes & Rate Limiting
app.use('/api/v1', apiLimiter, apiRoutes);

// 10. Static Frontend SPA Serving (Full-Stack Support)
if (fs.existsSync(webDistPath)) {
    app.use(express.static(webDistPath));
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
