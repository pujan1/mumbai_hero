import { Router } from 'express';
import {
  TalkToNpcRequestSchema,
  AcceptStorylineRequestSchema,
  DeclineStorylineRequestSchema,
  InteractWithObjectRequestSchema,
  EnterSceneRequestSchema,
  UpdateSettingsRequestSchema,
} from '@mumbai-hero/shared';
import type { GameStateRepository } from '../repositories/game-state.repository.js';
import { validate } from '../middleware/validate.middleware.js';
import { requirePlayerId } from '../middleware/player-id.middleware.js';
import {
  handleTalkToNpc,
  handleAcceptStoryline,
  handleDeclineStoryline,
  handleInteractWithObject,
  handleEnterScene,
  handleUpdateSettings,
} from '../services/game-engine.service.js';

function createActionHandler<T>(
  repo: GameStateRepository,
  handler: (playerId: string, state: import('@mumbai-hero/shared').ProgressionState, body: T) => import('../services/game-engine.service.js').ActionResult,
) {
  return async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
    try {
      const playerId = req.playerId!;
      const progression = await repo.getProgression(playerId);
      if (!progression) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      const result = handler(playerId, progression, req.body as T);
      await Promise.all([
        repo.saveProgression(playerId, result.state),
        repo.appendEvents(playerId, result.events),
      ]);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

export function createActionRouter(repo: GameStateRepository): Router {
  const router = Router();

  router.use(requirePlayerId);

  router.post(
    '/talk-to-npc',
    validate(TalkToNpcRequestSchema),
    createActionHandler(repo, handleTalkToNpc),
  );

  router.post(
    '/accept-storyline',
    validate(AcceptStorylineRequestSchema),
    createActionHandler(repo, handleAcceptStoryline),
  );

  router.post(
    '/decline-storyline',
    validate(DeclineStorylineRequestSchema),
    createActionHandler(repo, handleDeclineStoryline),
  );

  router.post(
    '/interact-with-object',
    validate(InteractWithObjectRequestSchema),
    createActionHandler(repo, handleInteractWithObject),
  );

  router.post(
    '/enter-scene',
    validate(EnterSceneRequestSchema),
    createActionHandler(repo, handleEnterScene),
  );

  router.post(
    '/update-settings',
    validate(UpdateSettingsRequestSchema),
    createActionHandler(repo, handleUpdateSettings),
  );

  return router;
}
