import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ENV } from '../config/env';

export const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let userCount = 0;
  let documentCount = 0;

  try {
    // Quick probe to verify database connectivity
    userCount = await prisma.user.count();
    documentCount = await prisma.document.count();
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  res.status(200).json({
    status: 'healthy',
    service: 'sandbox-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    securityMode: {
      active: req.securityMode,
      default: ENV.DEFAULT_SECURITY_MODE,
      supportedModes: ['vulnerable', 'patched'],
      toggleMechanism: "Send 'X-Security-Mode: patched' header or '?mode=patched' query parameter",
    },
    database: {
      status: dbStatus,
      dialect: 'sqlite',
      counts: {
        users: userCount,
        documents: documentCount,
      },
    },
    features: {
      owaspCovered: [
        { code: 'API1:2023', name: 'Broken Object Level Authorization (BOLA)' },
        { code: 'API2:2023', name: 'Broken Authentication' },
        { code: 'API5:2023', name: 'Broken Function Level Authorization (BFLA)' },
      ],
    },
  });
});
