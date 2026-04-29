# Asset Pipeline

## Sprite Sheets

All character sprites use a **100×100 px per frame** grid. Each character sheet contains:

- 4 directions × 5 frames = 20 frames total per character
- Frame order (left to right): idle, walk1, walk2, walk3, walk4
- Direction order (top to bottom): down, up, left, right

**Sheet dimensions:** 500×400 px (5 columns × 4 rows, each cell 100×100)

### Animation Keys

For a sprite with sheet key `player-boy`:
| Animation key | Frames |
|---------------|--------|
| `player-boy-walk-down` | row 0, frames 1–4 |
| `player-boy-walk-up` | row 1, frames 1–4 |
| `player-boy-walk-left` | row 2, frames 1–4 |
| `player-boy-walk-right` | row 3, frames 1–4 |
| `player-boy-idle-down` | row 0, frame 0 |
| `player-boy-idle-up` | row 1, frame 0 |
| `player-boy-idle-left` | row 2, frame 0 |
| `player-boy-idle-right` | row 3, frame 0 |

Animation keys are prefixed with the sprite sheet key (e.g. `player-boy-`, `player-girl-`). The `Player` entity uses `this.texture.key` to build the correct key at runtime.

Elder NPC sheets: **400×100 px** (4 columns × 1 row, each cell 100×100). Idle only — no walk cycle.

## Tilesets

- **Tile size:** 100×100 px
- **Format:** PNG, transparent background
- **Sheet width:** 1000 px (10 tiles per row)
- **Naming convention:** `tileset-<area>.png` (e.g., `tileset-kholi.png`, `tileset-neighborhood.png`)

Place tilesets in `client/public/assets/tilesets/`.

## Maps

- **Format:** Tiled JSON (`.tmj`)
- **Tile size:** 100×100
- **Required layers:**
  - `ground` — base floor tiles (no collision)
  - `decor` — decorative objects on top of ground (no collision)
  - `collision` — tiles with `collides: true` property set in Tiled
  - `objects` — Tiled object layer for spawn points and trigger zones

Place maps in `client/public/assets/maps/`.

## UI Assets

| Asset | Dimensions | File |
|-------|-----------|------|
| Stats HUD frame | 1200×260 px | `ui/hud-frame.png` |
| Dialogue box | 1200×208 px | `ui/dialogue-box.png` |
| D-pad | 300×300 px | `ui/dpad.png` |
| A button | 150×150 px | `ui/btn-a.png` |
| B button | 150×150 px | `ui/btn-b.png` |
| Title background | 1200×2600 px | `ui/title-bg.png` |

## Naming Rules

- All filenames: `kebab-case`
- No spaces in filenames
- Sprite keys in code match filename without extension: `npc-elder-bollywood` → `npc-elder-bollywood.png`
- To swap a placeholder, replace the PNG file — the Phaser texture key stays the same

## Loading Assets

All assets are loaded in `BootScene.preload()`. Add new assets there:

```typescript
// Sprite sheet (walking character — 5×4 grid, 100×100 per frame)
this.load.spritesheet('player-boy', 'assets/sprites/characters/player-boy.png', {
  frameWidth: 100, frameHeight: 100,
});

// Elder NPC sprite sheet (4×1 grid, 100×100 per frame)
this.load.spritesheet('npc-elder-bollywood', 'assets/sprites/npcs/npc-elder-bollywood.png', {
  frameWidth: 100, frameHeight: 100,
});

// Tileset (used as a plain image, not a Tiled tileset grid, until Tiled maps are introduced)
this.load.image('tileset-kholi', 'assets/tilesets/tileset-kholi.png');

// Map
this.load.tilemapTiledJSON('map-kholi', 'assets/maps/kholi-interior.tmj');
```
