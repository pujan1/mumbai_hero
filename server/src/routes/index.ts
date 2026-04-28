import { Router } from 'express';
import type { GameStateRepository } from '../repositories/game-state.repository.js';
import { createPlayerRouter } from './player.routes.js';
import { createStateRouter } from './state.routes.js';
import { createActionRouter } from './action.routes.js';

export function createRouter(repo: GameStateRepository): Router {
  const router = Router();
  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  router.use('/players', createPlayerRouter(repo));
  router.use('/state', createStateRouter(repo));
  router.use('/actions', createActionRouter(repo));
  return router;
}
