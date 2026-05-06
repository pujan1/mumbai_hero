import { ProgressionStateSchema, type ProgressionState } from '@mumbai-hero/shared';
import { STATE_CACHE_KEY, PLAYER_ID_KEY } from '../config/constants.js';
import { normalizeProgressionState } from '../utils/progression-state.js';

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
    const parsed = ProgressionStateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    return normalizeProgressionState(parsed.data);
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
