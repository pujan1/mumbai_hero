import type { GameEvent, ProgressionState } from '@mumbai-hero/shared';
import type {
  AcceptStorylineRequest,
  DeclineStorylineRequest,
  EnterSceneRequest,
  InteractWithObjectRequest,
  TalkToNpcRequest,
  UpdateSettingsRequest,
} from '@mumbai-hero/shared';
import { createEvent } from './event-log.service.js';
import { isValidStorylineId } from './storyline.service.js';
import { logger } from '../utils/logger.js';

export interface ActionResult {
  state: ProgressionState;
  events: GameEvent[];
}

export function handleTalkToNpc(
  playerId: string,
  state: ProgressionState,
  body: TalkToNpcRequest,
): ActionResult {
  const events: GameEvent[] = [
    createEvent('npc-talked', { npcId: body.npcId }),
  ];
  const newState = { ...state };
  newState.flags = { ...state.flags, [`met-${body.npcId}`]: true };
  logger.info('handleTalkToNpc', { playerId, npcId: body.npcId });
  return { state: newState, events };
}

export function handleAcceptStoryline(
  playerId: string,
  state: ProgressionState,
  body: AcceptStorylineRequest,
): ActionResult {
  if (!isValidStorylineId(body.storylineId)) {
    throw new Error(`Unknown storylineId: ${body.storylineId}`);
  }
  const current = state.storylines[body.storylineId];
  if (current.stage > 0) {
    return { state, events: [] };
  }
  const events: GameEvent[] = [
    createEvent('storyline-stage-advanced', {
      storylineId: body.storylineId,
      from: 0,
      to: 1,
    }),
  ];
  const newState: ProgressionState = {
    ...state,
    storylines: {
      ...state.storylines,
      [body.storylineId]: { stage: 1, startedAt: new Date().toISOString() },
    },
    flags: { ...state.flags, [`accepted-${body.storylineId}`]: true },
  };
  logger.info('handleAcceptStoryline', { playerId, storylineId: body.storylineId });
  return { state: newState, events };
}

export function handleDeclineStoryline(
  playerId: string,
  state: ProgressionState,
  body: DeclineStorylineRequest,
): ActionResult {
  const events: GameEvent[] = [
    createEvent('storyline-declined', { storylineId: body.storylineId }),
  ];
  const newState: ProgressionState = {
    ...state,
    flags: { ...state.flags, [`declined-${body.storylineId}`]: true },
  };
  logger.info('handleDeclineStoryline', { playerId, storylineId: body.storylineId });
  return { state: newState, events };
}

export function handleInteractWithObject(
  playerId: string,
  state: ProgressionState,
  body: InteractWithObjectRequest,
): ActionResult {
  const events: GameEvent[] = [
    createEvent('object-interacted', { objectId: body.objectId }),
  ];
  logger.info('handleInteractWithObject', { playerId, objectId: body.objectId });
  return { state, events };
}

export function handleEnterScene(
  playerId: string,
  state: ProgressionState,
  body: EnterSceneRequest,
): ActionResult {
  const events: GameEvent[] = [
    createEvent('scene-entered', { sceneId: body.sceneId, from: state.currentScene }),
  ];
  const newState: ProgressionState = {
    ...state,
    currentScene: body.sceneId,
    spawnPoint: body.spawnPoint ?? 'default',
  };
  logger.info('handleEnterScene', { playerId, sceneId: body.sceneId });
  return { state: newState, events };
}

export function handleUpdateSettings(
  playerId: string,
  state: ProgressionState,
  body: UpdateSettingsRequest,
): ActionResult {
  const newState: ProgressionState = {
    ...state,
    settings: { ...state.settings, ...body.settings },
  };
  const events: GameEvent[] = [createEvent('settings-updated', { settings: body.settings })];
  logger.info('handleUpdateSettings', { playerId });
  return { state: newState, events };
}
