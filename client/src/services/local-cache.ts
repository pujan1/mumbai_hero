import type { ProgressionState } from '@mumbai-hero/shared';
import { STATE_CACHE_KEY, PLAYER_ID_KEY } from '../config/constants.js';

export function getPlayerId(): string | null {
  return localStorage.getItem(PLAYER_ID_KEY);
}

export function setPlayerId(id: string): void {
  localStorage.setItem(PLAYER_ID_KEY, id);
}

export function getCachedState(): ProgressionState | null {
  const raw = localStorage.getItem(STATE_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProgressionState;
  } catch {
    return null;
  }
}

export function setCachedState(state: ProgressionState): void {
  localStorage.setItem(STATE_CACHE_KEY, JSON.stringify(state));
}

export function clearCache(): void {
  localStorage.removeItem(STATE_CACHE_KEY);
  localStorage.removeItem(PLAYER_ID_KEY);
}
