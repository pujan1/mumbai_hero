export const TILE_SIZE = 100;
export const MOVE_DURATION_MS = 220;  // slightly longer per-step at 100px tiles

// 12 tiles wide; height uses 19.5:9 iPhone ratio → 1200 × (19.5/9) = 2600
export const LOGICAL_WIDTH = 1200;
export const LOGICAL_HEIGHT = 2600;

export const LAYOUT = {
  HUD_HEIGHT: 130,                                      // name + storyline rows
  DIALOGUE_HEIGHT: Math.round(LOGICAL_HEIGHT * 0.08),  // 208px — slide-up overlay anchored to bottom
  // Dialogue is a transient overlay rather than a permanent reserve, so the
  // world camera owns everything below the HUD.
  GAME_HEIGHT: LOGICAL_HEIGHT - 130, // 2470px
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
