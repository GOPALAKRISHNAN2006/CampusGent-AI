import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';
import mongoose from 'mongoose';

const startServer = async () => {
    // Connect to Database
    await connectDB();

    // Auto-seed core roles if admin account does not exist or database is empty
    try {
        const adminExists = await User.findOne({ email: 'admin@campusgent.edu' });
        const userCount = await User.countDocuments();

        const shouldSeed = !adminExists && (
            env.NODE_ENV !== 'production' ||
            userCount === 0 ||
            process.env.AUTO_SEED === 'true' ||
            process.env.ALLOW_SEED_IN_PRODUCTION === 'true'
        );

        if (shouldSeed) {
            console.log('🌱 Admin account not detected or database empty. Initializing database with core roles (Admin, Faculty, Placement Officer, Student)...');
            await seedDatabase();
            console.log('✅ Auto-seed completed successfully.');
        } else if (!adminExists) {
            console.warn('⚠️ Admin account not detected in production. To seed core roles, visit /api/v1/system/seed?key=<JWT_SECRET> or set AUTO_SEED=true in environment variables.');
        }
    } catch (seedErr) {
        console.warn('⚠️ Auto-seed check notice:', seedErr.message);
    }

    // Start Express Listening
    const server = app.listen(env.PORT, () => {
        console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
        console.log(`📡 CORS Origin configured for: ${env.CLIENT_URL}`);
    });

    // Graceful Shutdown on termination signals
    const shutdown = async (signal) => {
        console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
        server.close(async () => {
            console.log('🔒 HTTP server closed.');
            try {
                await mongoose.connection.close(false);
                console.log('📦 Database connections closed.');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error closing database connections:', err);
                process.exit(1);
            }
        });

        // Force close after 10s timeout if connections hang
        setTimeout(() => {
            console.error('⚠️ Forcing process termination after 10s timeout.');
            process.exit(1);
        }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};
startServer().catch((error) => {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
});

