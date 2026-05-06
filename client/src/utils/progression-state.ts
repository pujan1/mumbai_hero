import {
  DEFAULT_BACKPACK_CAPACITY,
  DEFAULT_STORYLINE_PROGRESS,
  type ProgressionState,
  type StorylineProgress,
} from '@mumbai-hero/shared';

interface ProgressionStateLike {
  currentScene: string;
  spawnPoint: string;
  money: number;
  energy: number;
  inventory: ProgressionState['inventory'];
  backpackCapacity?: number | undefined;
  flags: ProgressionState['flags'];
  storylines: Partial<ProgressionState['storylines']>;
  settings: ProgressionState['settings'];
}

export function normalizeProgressionState(progression: ProgressionStateLike): ProgressionState {
  return {
    currentScene: progression.currentScene,
    spawnPoint: progression.spawnPoint,
    money: progression.money,
    energy: progression.energy,
    inventory: progression.inventory,
    backpackCapacity: progression.backpackCapacity ?? DEFAULT_BACKPACK_CAPACITY,
    flags: progression.flags,
    storylines: {
      bollywood: storylineProgress(progression.storylines.bollywood),
      'playback-singer': storylineProgress(progression.storylines['playback-singer']),
      textile: storylineProgress(progression.storylines.textile),
      fitness: storylineProgress(progression.storylines.fitness),
      food: storylineProgress(progression.storylines.food),
      cinematographer: storylineProgress(progression.storylines.cinematographer),
    },
    settings: progression.settings,
  };
}

function storylineProgress(progress: StorylineProgress | undefined): StorylineProgress {
  if (!progress) return { ...DEFAULT_STORYLINE_PROGRESS };
  return { ...progress };
}
