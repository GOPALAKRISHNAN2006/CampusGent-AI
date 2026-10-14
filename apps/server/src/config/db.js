import mongoose from 'mongoose';
import { env } from './env.js';
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI, {
            maxPoolSize: 20,
            minPoolSize: 4,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            heartbeatFrequencyMS: 10000,
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
