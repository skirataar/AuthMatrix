import { Request } from 'express';

export type SecurityMode = 'vulnerable' | 'patched';

export interface AuthenticatedUserPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'AUDITOR';
  tenantId: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      securityMode: SecurityMode;
      user?: AuthenticatedUserPayload;
    }
  }
}
