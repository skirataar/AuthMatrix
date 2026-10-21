import { Request, Response, NextFunction } from 'express';
import { ENV, SecurityMode } from '../config/env';

/**
 * Middleware that extracts and assigns the runtime security mode
 * ('vulnerable' vs 'patched') to the request object.
 *
 * Precedence:
 * 1. HTTP Request Header: 'x-security-mode: vulnerable | patched'
 * 2. Query Parameter: '?mode=vulnerable | patched'
 * 3. Environment Variable: DEFAULT_SECURITY_MODE (defaults to 'vulnerable')
 */
export function securityModeMiddleware(req: Request, res: Response, next: NextFunction): void {
  const headerMode = req.headers['x-security-mode']?.toString().toLowerCase();
  const queryMode = req.query.mode?.toString().toLowerCase();

  let mode: SecurityMode = ENV.DEFAULT_SECURITY_MODE;

  if (headerMode === 'patched' || headerMode === 'vulnerable') {
    mode = headerMode as SecurityMode;
  } else if (queryMode === 'patched' || queryMode === 'vulnerable') {
    mode = queryMode as SecurityMode;
  }

  req.securityMode = mode;
  res.setHeader('X-Active-Security-Mode', mode);

  next();
}
