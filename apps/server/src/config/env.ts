import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  MONGODB_URI: z.string().url('MONGODB_URI must be a valid connection URL'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
  JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET must be at least 8 characters'),
  AI_API_KEY: z.string().optional(),
  AI_API_URL: z.string().url().default('https://generativelanguage.googleapis.com/v1beta/openai'),
  AI_MODEL: z.string().default('gemini-1.5-flash'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Environment validation failed:', parseResult.error.format());
  process.exit(1);
}

export const env = parseResult.data;
