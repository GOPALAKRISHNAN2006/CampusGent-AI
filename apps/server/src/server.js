import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';

const startServer = async () => {
    // Connect to Database
    await connectDB();

    // Auto-seed core roles if admin account does not exist
    try {
        const adminExists = await User.findOne({ email: 'admin@campusgent.edu' });
        if (!adminExists) {
            console.log('🌱 Admin account not detected. Initializing database with core roles (Admin, Faculty, Placement Officer)...');
            await seedDatabase();
            console.log('✅ Auto-seed completed successfully.');
        }
    } catch (seedErr) {
        console.warn('⚠️ Auto-seed check notice:', seedErr.message);
    }

    // Start Express Listening
    app.listen(env.PORT, () => {
        console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
        console.log(`📡 CORS Origin configured for: ${env.CLIENT_URL}`);
    });
};
startServer().catch((error) => {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
});
