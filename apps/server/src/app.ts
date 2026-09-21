import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import { initializeAgentEcosystem } from './ai/agents';
import './models';

const app = express();

// Initialize the 21 AI agents ecosystem registry
initializeAgentEcosystem();

// 1. Trust Proxy (for accurate rate-limiting through reverse proxies)
app.set('trust proxy', 1);

// 2. HTTP Security Headers
app.use(helmet());

// 3. CORS configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 4. Content compression
app.use(compression());

// 5. Request Parsers
app.use(express.json());
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
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// 8. Basic Health Check Endpoint
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

// 9. API Routes & Rate Limiting
app.use('/api/v1', apiLimiter, apiRoutes);

// 10. Centralized Error Handler (Must be registered last)
app.use(errorHandler);

export default app;
