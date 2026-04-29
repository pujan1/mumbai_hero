export const TILE_SIZE = 100;
export const MOVE_DURATION_MS = 220;  // slightly longer per-step at 100px tiles

// 12 tiles wide; height uses 19.5:9 iPhone ratio → 1200 × (19.5/9) = 2600
export const LOGICAL_WIDTH = 1200;
export const LOGICAL_HEIGHT = 2600;

export const LAYOUT = {
  HUD_HEIGHT: Math.round(LOGICAL_HEIGHT * 0.10),       // 260px
  DIALOGUE_HEIGHT: Math.round(LOGICAL_HEIGHT * 0.08),  // 208px
  GAME_HEIGHT: Math.round(LOGICAL_HEIGHT * 0.82),      // 2132px  (~21 tiles visible)
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
