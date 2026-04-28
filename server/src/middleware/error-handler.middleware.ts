import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const message = err instanceof Error ? err.message : 'Internal server error';
  logger.error('Unhandled error', { message, url: req.url, method: req.method });
  res.status(500).json({ error: message });
}
