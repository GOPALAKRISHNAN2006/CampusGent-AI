import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

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
