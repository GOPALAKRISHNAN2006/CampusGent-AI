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
    PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
    MONGODB_URI: z.string().url('MONGODB_URI must be a valid connection URL'),
    JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
    JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET must be at least 8 characters'),
    AI_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    AI_API_URL: z.string().url().default('https://generativelanguage.googleapis.com/v1beta/openai'),
    AI_MODEL: z.string().default('gemini-3.5-flash-lite'),
    CLIENT_URL: z.string().default('http://localhost:5173'),
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
