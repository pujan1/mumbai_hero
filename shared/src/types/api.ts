import type { CharacterChoice, GameEvent, PlayerProfile, ProgressionState } from './game-state.js';

export interface CreatePlayerRequest {
  characterChoice: CharacterChoice;
  displayName?: string;
}

export interface CreatePlayerResponse {
  playerId: string;
  profile: PlayerProfile;
  state: ProgressionState;
  events: GameEvent[];
}

export interface GetStateResponse {
  profile: PlayerProfile;
  progression: ProgressionState;
  recentEvents: GameEvent[];
}

export interface ActionResponse {
  state: ProgressionState;
  events: GameEvent[];
}

export interface TalkToNpcRequest {
  npcId: string;
}

export interface AcceptStorylineRequest {
  storylineId: string;
}

export interface DeclineStorylineRequest {
  storylineId: string;
}

export interface InteractWithObjectRequest {
  objectId: string;
}

export interface EnterSceneRequest {
  sceneId: string;
  spawnPoint?: string;
}

export interface UpdateSettingsRequest {
  settings: {
    audioVolume?: number;
    controlScheme?: 'default';
  };
}

export interface ApiError {
  error: string;
  code?: string;
}
