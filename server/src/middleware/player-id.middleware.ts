import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      playerId?: string;
    }
  }
}

export function playerIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const playerId = req.headers['x-player-id'];
  if (typeof playerId === 'string' && playerId.length > 0) {
    req.playerId = playerId;
  }
  next();
}

export function requirePlayerId(req: Request, res: Response, next: NextFunction): void {
  if (!req.playerId) {
    res.status(401).json({ error: 'Missing X-Player-Id header' });
    return;
  }
  next();
}
