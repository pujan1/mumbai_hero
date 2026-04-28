import { z } from 'zod';
import { CharacterChoiceSchema, GameEventSchema, PlayerProfileSchema, ProgressionStateSchema } from './game-state.schema.js';

export const CreatePlayerRequestSchema = z.object({
  characterChoice: CharacterChoiceSchema,
  displayName: z.string().max(32).optional(),
});

export const TalkToNpcRequestSchema = z.object({
  npcId: z.string(),
});

export const AcceptStorylineRequestSchema = z.object({
  storylineId: z.string(),
});

export const DeclineStorylineRequestSchema = z.object({
  storylineId: z.string(),
});

export const InteractWithObjectRequestSchema = z.object({
  objectId: z.string(),
});

export const EnterSceneRequestSchema = z.object({
  sceneId: z.string(),
  spawnPoint: z.string().optional(),
});

export const UpdateSettingsRequestSchema = z.object({
  settings: z.object({
    audioVolume: z.number().min(0).max(1).optional(),
    controlScheme: z.literal('default').optional(),
  }),
});

export const ActionResponseSchema = z.object({
  state: ProgressionStateSchema,
  events: z.array(GameEventSchema),
});

export const GetStateResponseSchema = z.object({
  profile: PlayerProfileSchema,
  progression: ProgressionStateSchema,
  recentEvents: z.array(GameEventSchema),
});

export const CreatePlayerResponseSchema = z.object({
  playerId: z.string().uuid(),
  profile: PlayerProfileSchema,
  state: ProgressionStateSchema,
  events: z.array(GameEventSchema),
});
