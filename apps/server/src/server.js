import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
const startServer = async () => {
    // Connect to Database
    await connectDB();
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
