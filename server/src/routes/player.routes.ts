import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerRequestSchema, createInitialProgression } from '@mumbai-hero/shared';
import type { PlayerProfile } from '@mumbai-hero/shared';
import type { GameStateRepository } from '../repositories/game-state.repository.js';
import { validate } from '../middleware/validate.middleware.js';
import { requirePlayerId } from '../middleware/player-id.middleware.js';
import { logger } from '../utils/logger.js';

export function createPlayerRouter(repo: GameStateRepository): Router {
  const router = Router();

  router.post('/', validate(CreatePlayerRequestSchema), async (req, res, next) => {
    try {
      const { characterChoice, displayName } = req.body as { characterChoice: 'boy' | 'girl'; displayName?: string };
      const playerId = uuidv4();
      const now = new Date().toISOString();
      const profile: PlayerProfile = {
        playerId,
        displayName: displayName ?? null,
        characterChoice,
        createdAt: now,
        lastPlayedAt: now,
        saveVersion: 1,
      };
      const initialState = createInitialProgression();
      await repo.createPlayer(profile, initialState);
      logger.info('Player created', { playerId, characterChoice });
      res.status(201).json({ playerId, profile, state: initialState, events: [] });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', requirePlayerId, async (req, res, next) => {
    try {
      const profile = await repo.getProfile(req.params['id'] ?? '');
      if (!profile) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      res.json({ profile });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
