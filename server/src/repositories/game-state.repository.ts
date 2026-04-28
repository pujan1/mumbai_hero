import type { GameEvent, PlayerProfile, ProgressionState } from '@mumbai-hero/shared';

export interface GameStateRepository {
  createPlayer(profile: PlayerProfile, initialState: ProgressionState): Promise<void>;
  getProfile(playerId: string): Promise<PlayerProfile | null>;
  getProgression(playerId: string): Promise<ProgressionState | null>;
  saveProgression(playerId: string, state: ProgressionState): Promise<void>;
  appendEvents(playerId: string, events: GameEvent[]): Promise<void>;
  getRecentEvents(playerId: string, limit: number): Promise<GameEvent[]>;
}
