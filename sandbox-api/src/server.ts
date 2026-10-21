import { createApp } from './app';
import { ENV } from './config/env';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log('====================================================');
  console.log(`[SANDBOX API] Server active on http://localhost:${ENV.PORT}`);
  console.log(`[SANDBOX API] Default Mode: ${ENV.DEFAULT_SECURITY_MODE.toUpperCase()}`);
  console.log(`[SANDBOX API] Database URL: ${ENV.DATABASE_URL}`);
  console.log(`[SANDBOX API] Telemetry Health: http://localhost:${ENV.PORT}/health`);
  console.log('====================================================');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[SANDBOX API] Received SIGTERM. Shutting down gracefully...');
  server.close(() => {
    console.log('[SANDBOX API] Process terminated.');
  });
});
