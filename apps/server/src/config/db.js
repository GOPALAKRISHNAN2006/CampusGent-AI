import mongoose from 'mongoose';
import { env } from './env.js';
let isConnecting = false;

export const connectDB = async (retryCount = 0) => {
    if (mongoose.connection.readyState === 1) return;
    if (isConnecting) return;
    isConnecting = true;

    try {
        const conn = await mongoose.connect(env.MONGODB_URI, {
            maxPoolSize: 20,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            heartbeatFrequencyMS: 10000,
        });
        isConnecting = false;
        console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        isConnecting = false;
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        if (env.NODE_ENV === 'production' && retryCount < 10) {
            console.log(`🔄 Retrying MongoDB connection in 5 seconds (attempt ${retryCount + 1}/10)...`);
            setTimeout(() => connectDB(retryCount + 1), 5000);
        } else if (env.NODE_ENV !== 'production' && retryCount === 0) {
            process.exit(1);
        }
    }
};
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected.');
});
mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB error event: ${err.message}`);
});
