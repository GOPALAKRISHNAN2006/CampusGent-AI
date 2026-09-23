import mongoose from 'mongoose';
import { env } from './env.js';
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI, {
            maxPoolSize: 10,
        });
        console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected.');
});
mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB error event: ${err.message}`);
});
