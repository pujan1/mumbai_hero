# Asset Pipeline

## Sprite Sheets

All character sprites use a **32×32 px per frame** grid. Each character sheet contains:

- 4 directions × 5 frames = 20 frames total per character
- Frame order (left to right): idle, walk1, walk2, walk3, walk4
- Direction order (top to bottom): down, up, left, right

**Sheet dimensions:** 160 × 128 px (5 columns × 4 rows, each cell 32×32)

### Animation Keys

For a sprite with sheet key `player-boy`:
| Animation key | Frames |
|---------------|--------|
| `player-walk-down` | row 0, frames 1–4 |
| `player-walk-up` | row 1, frames 1–4 |
| `player-walk-left` | row 2, frames 1–4 |
| `player-walk-right` | row 3, frames 1–4 |
| `player-idle-down` | row 0, frame 0 |
| `player-idle-up` | row 1, frame 0 |
| `player-idle-left` | row 2, frame 0 |
| `player-idle-right` | row 3, frame 0 |

NPC sprites follow the same convention but only require 1 idle frame per direction (no walk cycle needed for stationary NPCs).

## Tilesets

- **Tile size:** 32×32 px
- **Format:** PNG, transparent background
- **Max sheet width:** 512 px (16 tiles wide)
- **Naming convention:** `tileset-<area>.png` (e.g., `tileset-kholi.png`, `tileset-neighborhood.png`)

Place tilesets in `client/public/assets/tilesets/`.

## Maps

- **Format:** Tiled JSON (`.tmj`)
- **Tile size:** 32×32
- **Required layers:**
  - `ground` — base floor tiles (no collision)
  - `decor` — decorative objects on top of ground (no collision)
  - `collision` — tiles with `collides: true` property set in Tiled
  - `objects` — Tiled object layer for spawn points and trigger zones

Place maps in `client/public/assets/maps/`.

## UI Assets

| Asset | Dimensions | File |
|-------|-----------|------|
| Stats HUD frame | 360×128 px | `ui/hud-frame.png` |
| Dialogue box | 360×96 px | `ui/dialogue-box.png` |
| D-pad | 128×128 px | `ui/dpad.png` |
| A button | 64×64 px | `ui/btn-a.png` |
| B button | 64×64 px | `ui/btn-b.png` |
| Title background | 360×640 px | `ui/title-bg.png` |

## Naming Rules

- All filenames: `kebab-case`
- No spaces in filenames
- Sprite keys in code match filename without extension: `npc-elder-bollywood` → `npc-elder-bollywood.png`
- To swap a placeholder, replace the PNG file — the Phaser texture key stays the same

## Loading Assets

All assets are loaded in `BootScene.preload()`. Add new assets there:

```typescript
// Sprite sheet
this.load.spritesheet('player-boy', 'assets/sprites/characters/player-boy.png', {
  frameWidth: 32, frameHeight: 32,
});

// Tileset
this.load.image('tileset-kholi', 'assets/tilesets/tileset-kholi.png');

// Map
this.load.tilemapTiledJSON('map-kholi', 'assets/maps/kholi-interior.tmj');
```
