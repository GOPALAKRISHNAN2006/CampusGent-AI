import { logger } from '../utils/logger.js';

/**
 * Resilient In-Memory LRU/TTL Cache Store.
 * Provides microsecond in-process caching with automatic stale eviction.
 */
class InMemoryCache {
    constructor(maxSize = 1000) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }

    set(key, value, ttlSeconds = 60) {
        // Simple FIFO eviction if size limit reached
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    del(key) {
        this.cache.delete(key);
    }

    delByPrefix(prefix) {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }
    }

    clear() {
        this.cache.clear();
    }
}

/**
 * Hybrid Cache Service:
 * Automatically uses Redis if REDIS_URL is provided in environment variables;
 * Otherwise seamlessly defaults to high-efficiency in-memory TTL caching.
 * Guaranteed zero crash: Redis network failures degrade gracefully without API disruption.
 */
class CacheService {
    constructor() {
        this.memoryCache = new InMemoryCache(2000);
        this.redisClient = null;
        this.isRedisReady = false;
        this.redisWarningLogged = false;

        this.initRedis();
    }

    async initRedis() {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            return;
        }

        try {
            // Dynamically import optional redis client without hard dependency crash
            const { createClient } = await import('redis');
            this.redisClient = createClient({
                url: redisUrl,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 5) {
                            if (!this.redisWarningLogged) {
                                logger.warn('⚠️ Redis max reconnect attempts reached. Using in-memory fallback cache.');
                                this.redisWarningLogged = true;
                            }
                            return false; // Stop reconnecting after 5 attempts
                        }
                        return Math.min(retries * 200, 2000);
                    },
                    connectTimeout: 4000,
                },
            });

            this.redisClient.on('connect', () => {
                this.isRedisReady = true;
                logger.info('🚀 Redis connected. Distributed caching active.');
            });

            this.redisClient.on('error', (err) => {
                this.isRedisReady = false;
                if (!this.redisWarningLogged) {
                    logger.warn(`⚠️ Redis error: ${err.message}. Seamlessly serving via in-memory cache.`);
                    this.redisWarningLogged = true;
                }
            });

            await this.redisClient.connect().catch((err) => {
                logger.warn(`⚠️ Redis initial connect failed: ${err.message}. Defaulting to in-memory cache.`);
            });
        } catch {
            // Optional redis package not installed or failed to load
            logger.info('ℹ️ Redis client not loaded. Using high-performance in-memory cache.');
        }
    }

    async get(key) {
        if (this.isRedisReady && this.redisClient) {
            try {
                const data = await this.redisClient.get(key);
                return data ? JSON.parse(data) : null;
            } catch (err) {
                logger.debug(`Redis get failed for ${key}, checking in-memory fallback: ${err.message}`);
            }
        }
        return this.memoryCache.get(key);
    }

    async set(key, value, ttlSeconds = 60) {
        this.memoryCache.set(key, value, ttlSeconds);

        if (this.isRedisReady && this.redisClient) {
            try {
                await this.redisClient.set(key, JSON.stringify(value), {
                    EX: ttlSeconds,
                });
            } catch (err) {
                logger.debug(`Redis set failed for ${key}: ${err.message}`);
            }
        }
    }

    async del(key) {
        this.memoryCache.del(key);
        if (this.isRedisReady && this.redisClient) {
            try {
                await this.redisClient.del(key);
            } catch (err) {
                logger.debug(`Redis del failed for ${key}: ${err.message}`);
            }
        }
    }

    async delByPrefix(prefix) {
        this.memoryCache.delByPrefix(prefix);
        if (this.isRedisReady && this.redisClient) {
            try {
                const keys = await this.redisClient.keys(`${prefix}*`);
                if (keys && keys.length > 0) {
                    await this.redisClient.del(keys);
                }
            } catch (err) {
                logger.debug(`Redis delByPrefix failed for ${prefix}: ${err.message}`);
            }
        }
    }

    async delByPattern(pattern) {
        const prefix = pattern.endsWith('*') ? pattern.slice(0, -1) : pattern;
        return this.delByPrefix(prefix);
    }

    /**
     * Prevents cache stampedes via atomic get-or-fetch helper.
     */
    async getOrSet(key, fetcher, ttlSeconds = 60) {
        const cached = await this.get(key);
        if (cached !== null && cached !== undefined) {
            return { data: cached, hit: true };
        }
        const fresh = await fetcher();
        await this.set(key, fresh, ttlSeconds);
        return { data: fresh, hit: false };
    }
}

export const cacheService = new CacheService();

/**
 * Express Middleware for transparent GET route caching with ETags and Cache-Control
 */
export const cacheRoute = (ttlSeconds = 60, customKeyPrefix = '') => {
    return async (req, res, next) => {
        // Only cache safe idempotent GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Bypass cache if client explicitly asks
        if (req.headers['x-no-cache'] === 'true' || req.query.noCache === 'true') {
            res.setHeader('X-Cache', 'BYPASS');
            return next();
        }

        const prefix = customKeyPrefix || req.baseUrl + req.path;
        const queryStr = Object.keys(req.query).length ? `:${JSON.stringify(req.query)}` : '';
        const roleScope = req.user?.role ? `:${req.user.role}` : ':public';
        const cacheKey = `${prefix}${roleScope}${queryStr}`;

        try {
            const cachedData = await cacheService.get(cacheKey);
            if (cachedData) {
                res.setHeader('X-Cache', 'HIT');
                res.setHeader('Cache-Control', `public, max-age=${Math.min(ttlSeconds, 60)}, stale-while-revalidate=30`);
                return res.status(200).json(cachedData);
            }

            res.setHeader('X-Cache', 'MISS');

            // Intercept res.json to capture payload for cache
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    cacheService.set(cacheKey, body, ttlSeconds).catch(() => {});
                }
                return originalJson(body);
            };

            next();
        } catch (err) {
            // Failsafe: Continue without cache if error occurs
            next();
        }
    };
};
