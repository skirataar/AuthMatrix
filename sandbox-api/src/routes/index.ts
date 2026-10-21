import { Router } from 'express';
import { healthRouter } from './health.routes';

export const rootRouter = Router();

rootRouter.use('/health', healthRouter);
