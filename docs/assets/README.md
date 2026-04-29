# Asset Generation — Standards & Quick Reference

All prompts use the **100 px tile / 1200×2600 logical canvas** standard.  
Copy the visual-style boilerplate verbatim into every prompt.

---

## File index

| File | Contents |
|------|----------|
| [01-characters.md](01-characters.md) | Player Boy, Player Girl |
| [02-elder-npcs.md](02-elder-npcs.md) | 6 Elder NPCs (Bollywood, Music, Textile, Fitness, Food, Cinema) |
| [03-ambient-npcs.md](03-ambient-npcs.md) | Chai Wallah, Cricket Kid, Laundry Aunty, Vendor, Dog |
| [04-tilesets.md](04-tilesets.md) | Kholi interior, Neighborhood exterior, Train station, House interior |
| [05-vehicles.md](05-vehicles.md) | Mumbai Local Train, BEST Bus |
| [06-ui.md](06-ui.md) | HUD frame, Dialogue box, D-pad, Buttons A/B, Title background |

---

## Resolution & tile constants

| Constant | Value | Notes |
|---|---|---|
| `TILE_SIZE` | **100 px** | One map tile = 100 × 100 px |
| `LOGICAL_WIDTH` | **1200 px** | 12 tiles across the viewport |
| `LOGICAL_HEIGHT` | **2600 px** | 19.5:9 iPhone ratio |
| Game view height | ~2132 px | 82 % of 2600 — ~21 tiles tall |
| HUD area | 260 px | Top 10 % |
| Dialogue area | 208 px | 8 % below HUD |

---

## Visual-style boilerplate

Embed this sentence verbatim at the start of every image-generation prompt:

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow effects, no drop shadows, no gradients, no post-processing filters."

---

## Sprite-sheet grid conventions

### Walking characters (player + ambient NPCs)

```
PNG size:  500 × 400 px  (5 cols × 4 rows, 20 frames)
Cell size: 100 × 100 px

Row 0 (y=0):    DOWN  — col 0 idle | cols 1–4 walk cycle
Row 1 (y=100):  UP    — col 0 idle | cols 1–4 walk cycle
Row 2 (y=200):  LEFT  — col 0 idle | cols 1–4 walk cycle
Row 3 (y=300):  RIGHT — col 0 idle | cols 1–4 walk cycle
```

Phaser load:
```ts
this.load.spritesheet('player-boy', 'assets/sprites/characters/player-boy.png', {
  frameWidth: 100, frameHeight: 100,
})
```

Frame index map:
- 0 = idle-down, 1–4 = walk-down
- 5 = idle-up,   6–9 = walk-up
- 10 = idle-left, 11–14 = walk-left
- 15 = idle-right, 16–19 = walk-right

---

### Elder NPCs (stationary, idle only)

```
PNG size:  400 × 100 px  (4 cols × 1 row, 4 frames)
Cell size: 100 × 100 px

Col 0 (x=0):   DOWN  (primary — facing arriving player)
Col 1 (x=100): UP
Col 2 (x=200): LEFT
Col 3 (x=300): RIGHT
```

Phaser load:
```ts
this.load.spritesheet('npc-elder-bollywood', 'assets/sprites/npcs/npc-elder-bollywood.png', {
  frameWidth: 100, frameHeight: 100,
})
```

Animation registration (boot-scene.ts):
```ts
['down','up','left','right'].forEach((dir, frame) => {
  anims.create({ key: `npc-elder-bollywood-idle-${dir}`, frames: [{ key: 'npc-elder-bollywood', frame }], repeat: -1 })
})
```

---

### Stray Dog (3-frame walk cycle)

```
PNG size:  300 × 400 px  (3 cols × 4 rows, 12 frames)
Cell size: 100 × 100 px

Col 0: idle | Col 1: walk-frame-1 | Col 2: walk-frame-2
Row 0: DOWN | Row 1: UP | Row 2: LEFT | Row 3: RIGHT
```

---

## Tileset standard

```
Tile size:    100 × 100 px
Sheet width:  1000 px  (10 tiles per row)
Background:   transparent PNG
Seamless:     all ground/floor tiles must tile seamlessly
```

---

## Critical constraints (every asset)

- **No anti-aliasing** — every pixel is one solid colour.
- **1-pixel black outlines** on all character and object edges.
- **Transparent PNG** for sprites and UI overlays (except the title screen, fully opaque).
- **Exact output dimensions** — no extra padding or canvas overflow.
- **Maximum colour counts** listed per asset — stay within them.

---

## Wiring checklist (per new sprite)

1. Drop PNG into correct path under `client/public/assets/`.
2. Add `this.load.spritesheet(...)` or `this.load.image(...)` in `boot-scene.ts → preload()`.
3. Remove the matching line from `createPlaceholderTextures()`.
4. Register animations in `createAnimations()` if the sprite is animated.
