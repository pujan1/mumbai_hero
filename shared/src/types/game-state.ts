export type CharacterChoice = 'boy' | 'girl';

export type StorylineId =
  | 'bollywood'
  | 'playback-singer'
  | 'textile'
  | 'fitness'
  | 'food'
  | 'cinematographer';

export interface PlayerProfile {
  playerId: string;
  displayName: string | null;
  characterChoice: CharacterChoice;
  createdAt: string;
  lastPlayedAt: string;
  saveVersion: number;
}

export interface StorylineProgress {
  stage: number;
  startedAt: string | null;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface Settings {
  audioVolume: number;
  controlScheme: 'default';
}

export interface ProgressionState {
  currentScene: string;
  spawnPoint: string;
  money: number;
  energy: number;
  inventory: InventoryItem[];
  backpackCapacity: number;
  flags: Record<string, boolean>;
  storylines: Record<StorylineId, StorylineProgress>;
  settings: Settings;
}

export const DEFAULT_BACKPACK_CAPACITY = 25;

export interface GameEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface GameState {
  profile: PlayerProfile;
  progression: ProgressionState;
  recentEvents: GameEvent[];
}

export const DEFAULT_STORYLINE_PROGRESS: StorylineProgress = {
  stage: 0,
  startedAt: null,
};

export function createInitialProgression(): ProgressionState {
  return {
    currentScene: 'kholi-interior-scene',
    spawnPoint: 'default',
    money: 100,
    energy: 100,
    inventory: [],
    backpackCapacity: DEFAULT_BACKPACK_CAPACITY,
    flags: {},
    storylines: {
      bollywood: { ...DEFAULT_STORYLINE_PROGRESS },
      'playback-singer': { ...DEFAULT_STORYLINE_PROGRESS },
      textile: { ...DEFAULT_STORYLINE_PROGRESS },
      fitness: { ...DEFAULT_STORYLINE_PROGRESS },
      food: { ...DEFAULT_STORYLINE_PROGRESS },
      cinematographer: { ...DEFAULT_STORYLINE_PROGRESS },
    },
    settings: {
      audioVolume: 0.8,
      controlScheme: 'default',
    },
  };
}
