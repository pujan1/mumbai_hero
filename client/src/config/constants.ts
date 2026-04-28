export const TILE_SIZE = 32;
export const MOVE_DURATION_MS = 200;

export const LOGICAL_WIDTH = 360;
export const LOGICAL_HEIGHT = 640;

export const LAYOUT = {
  HUD_HEIGHT: Math.round(LOGICAL_HEIGHT * 0.20),
  DIALOGUE_HEIGHT: Math.round(LOGICAL_HEIGHT * 0.13),
  GAME_HEIGHT: Math.round(LOGICAL_HEIGHT * 0.67),
} as const;

export const KEYS = {
  UP: ['UP', 'W'],
  DOWN: ['DOWN', 'S'],
  LEFT: ['LEFT', 'A'],
  RIGHT: ['RIGHT', 'D'],
  ACTION: ['Z', 'SPACE'],
  CANCEL: ['X', 'SHIFT'],
  START: ['ENTER'],
} as const;

export const API_BASE_URL = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3001';
export const PLAYER_ID_KEY = 'mumbai-hero-player-id';
export const STATE_CACHE_KEY = 'mumbai-hero-state-cache';
