import { z } from 'zod';

export const CharacterChoiceSchema = z.enum(['boy', 'girl']);

export const StorylineIdSchema = z.enum([
  'bollywood',
  'playback-singer',
  'textile',
  'fitness',
  'food',
  'cinematographer',
]);

export const PlayerProfileSchema = z.object({
  playerId: z.string().uuid(),
  displayName: z.string().nullable(),
  characterChoice: CharacterChoiceSchema,
  createdAt: z.string().datetime(),
  lastPlayedAt: z.string().datetime(),
  saveVersion: z.number().int().nonnegative(),
});

export const StorylineProgressSchema = z.object({
  stage: z.number().int().nonnegative(),
  startedAt: z.string().datetime().nullable(),
});

export const InventoryItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number().int().positive(),
});

export const SettingsSchema = z.object({
  audioVolume: z.number().min(0).max(1),
  controlScheme: z.literal('default'),
});

export const ProgressionStateSchema = z.object({
  currentScene: z.string(),
  spawnPoint: z.string(),
  money: z.number().nonnegative(),
  energy: z.number().min(0).max(100),
  inventory: z.array(InventoryItemSchema),
  flags: z.record(z.string(), z.boolean()),
  storylines: z.record(StorylineIdSchema, StorylineProgressSchema),
  settings: SettingsSchema,
});

export const GameEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  payload: z.record(z.string(), z.unknown()),
  timestamp: z.string().datetime(),
});
