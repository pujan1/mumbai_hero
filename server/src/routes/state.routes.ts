import { Router } from 'express';
import type { GameStateRepository } from '../repositories/game-state.repository.js';
import { requirePlayerId } from '../middleware/player-id.middleware.js';

export function createStateRouter(repo: GameStateRepository): Router {
  const router = Router();

  router.get('/', requirePlayerId, async (req, res, next) => {
    try {
      const playerId = req.playerId!;
      const [profile, progression, recentEvents] = await Promise.all([
        repo.getProfile(playerId),
        repo.getProgression(playerId),
        repo.getRecentEvents(playerId, 50),
      ]);
      if (!profile || !progression) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      const now = new Date().toISOString();
      await repo.createPlayer({ ...profile, lastPlayedAt: now }, progression);
      res.json({ profile: { ...profile, lastPlayedAt: now }, progression, recentEvents });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
