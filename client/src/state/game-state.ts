import type { PlayerProfile, ProgressionState } from '@mumbai-hero/shared';

export interface ClientGameState {
  profile: PlayerProfile | null;
  progression: ProgressionState | null;
  isOffline: boolean;
  isLoaded: boolean;
}

export const clientGameState: ClientGameState = {
  profile: null,
  progression: null,
  isOffline: false,
  isLoaded: false,
};
