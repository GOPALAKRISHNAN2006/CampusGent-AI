import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from apps/server and workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();
const rawApiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.union([z.string(), z.number()]).transform((val) => typeof val === 'number' ? val : parseInt(val, 10)).default(5000),
    MONGODB_URI: z.string().url('MONGODB_URI must be a valid connection URL'),
    JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
    JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET must be at least 8 characters').optional().default('campusgent_jwt_refresh_secure_token_key_123456'),
    AI_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    AI_API_URL: z.string().url().default('https://generativelanguage.googleapis.com/v1beta/openai'),
    AI_MODEL: z.string().default('gemini-3.5-flash-lite'),
    CLIENT_URL: z.string().default('http://localhost:5173'),
}).superRefine((data) => {
    if (data.NODE_ENV === 'production') {
        const weakSecrets = ['devsecret', 'supersecret', 'secret123', 'dev_jwt_secret', 'defaultsecret'];
        if (data.JWT_SECRET.length < 16) {
            console.warn('⚠️ [SECURITY NOTICE] JWT_SECRET is recommended to be at least 16 characters in production environments.');
        }
        if (weakSecrets.some(w => data.JWT_SECRET.toLowerCase().includes(w))) {
            console.warn('⚠️ [SECURITY NOTICE] JWT_SECRET contains common development patterns. For hardened production security, configure a 32+ character random secret in your Render dashboard.');
        }
        if (data.JWT_REFRESH_SECRET === data.JWT_SECRET) {
            console.warn('⚠️ [SECURITY NOTICE] JWT_REFRESH_SECRET is identical to JWT_SECRET. Using distinct secrets is recommended.');
        }
    }
});
const parseResult = envSchema.safeParse({
    ...process.env,
    AI_API_KEY: rawApiKey,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || rawApiKey,
});
if (!parseResult.success) {
    console.error('❌ Environment validation failed:', parseResult.error.format());
    process.exit(1);
}
export const env = parseResult.data;
