import express, { Express } from 'express';
import cors from 'cors';
import { securityModeMiddleware } from './middleware/security-mode';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/error-handler';
import { rootRouter } from './routes';
import { healthRouter } from './routes/health.routes';

export function createApp(): Express {
  const app = express();

  // Standard middleware
  app.use(cors({
    origin: '*', // Permissive for local sandbox testing
    exposedHeaders: ['X-Active-Security-Mode'],
  }));
  app.use(express.json());

  // Dynamic security mode toggle middleware
  app.use(securityModeMiddleware);

  // Request telemetry logger
  app.use(requestLogger);

  // Mount health check directly on /health as well as through API router
  app.use('/health', healthRouter);
  app.use('/api', rootRouter);

  // Fallback 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      path: req.originalUrl,
      mode: req.securityMode,
    });
  });

  // Centralized defensive error handler
  app.use(errorHandler);

  return app;
}
