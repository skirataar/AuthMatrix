import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isVulnerable = req.securityMode === 'vulnerable';

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  if (isVulnerable) {
    // VULNERABLE PATTERN: Leaking stack trace and internal system details directly to API clients (CWE-209)
    res.status(statusCode).json({
      error: err.message,
      stack: err.stack,
      details: err.details,
      securityAdvisory: 'WARNING: Verbose internal error details exposed due to vulnerable mode configuration.',
    });
    return;
  }

  // SECURE / PATCHED PATTERN: Sanitized, predictable error schema without exposing internal implementation details
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : err.message,
    code: statusCode >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST',
    timestamp: new Date().toISOString(),
  });
}
