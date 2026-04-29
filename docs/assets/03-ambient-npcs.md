---
name: Ambient NPC Sprites
description: Generation prompts for walking ambient NPCs (C1-C3), stationary vendor (D1), and stray dog (E1)
type: reference
---

# C — Ambient NPC Sprite Sheets (walking)

All walking ambient NPCs: **500 × 400 px** sheet, 5 cols × 4 rows, 100 × 100 px per cell, all 20 cells filled. Same grid as player sprites.

```
Row 0 (y=0):    facing DOWN  — col 0: idle | cols 1–4: walk cycle
Row 1 (y=100):  facing UP    — col 0: idle | cols 1–4: walk cycle
Row 2 (y=200):  facing LEFT  — col 0: idle | cols 1–4: walk cycle
Row 3 (y=300):  facing RIGHT — col 0: idle | cols 1–4: walk cycle
```

---

## C1 — Chai Wallah

**Path:** `assets/sprites/npcs/npc-chai-wallah.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Col 0 idle, cols 1–4 walk cycle. Character: young Indian man, mid-20s, lean. Short black hair (#1A1A1A). Warm brown skin (#8B5A2B). Plain white vest/banyan (#F5F5F5). Beige rolled-up trousers (#D2B48C). Right hand holds a dark brown tin kettle (#5C4033, 10 × 14 px teardrop shape); left hand holds a tiny off-white glass (#F0F0F0, 6 × 8 px). Walk frames: legs alternate, kettle stays in right hand. Maximum 26 colors."

---

## C2 — Cricket Kid

**Path:** `assets/sprites/npcs/npc-cricket-kid.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Col 0 idle, cols 1–4 walk cycle. Character: Indian boy ~10 years old, noticeably shorter — character art occupies only the top 75 px of each 100 × 100 cell (bottom 25 px transparent). Head ~22 × 20 px at y = 6–26. Short black hair (#1A1A1A). Warm brown skin (#8B5A2B). White school shirt (#F5F5F5). Royal blue school shorts (#0047AB). Idle and facing-down: holding a tan cricket bat (#C8A96E) — a thin 4 × 28 px vertical rectangle beside the body with a 10 × 6 px rectangular blade at the bottom. Walk frames: bat swings slightly with movement. Maximum 24 colors."

---

## C3 — Laundry Aunty

**Path:** `assets/sprites/npcs/npc-laundry-aunty.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Col 0 idle, cols 1–4 walk cycle. Character: middle-aged Indian woman, slightly plump — torso visibly wider (~58 px at shoulders). Hair in a tight bun — dark #1A1A1A circle (~18 px diameter) from above. Warm brown skin (#7A4A28). Forest-green sari (#228B22) with 4-px golden-yellow border stripe (#DAA520) along the draping edge at torso bottom. Idle and facing-down: pale-blue damp cloth (#B0C4DE, 50 × 10 px) draped across both arms as a wide band at midriff level. Walk frames: cloth sways slightly. Maximum 28 colors."

---

# D — Stationary Ambient NPC

## D1 — Vegetable Vendor

**Path:** `assets/sprites/npcs/npc-vendor.png`

```
Output PNG:  100 × 100 px  — single frame, no animation
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 100 × 100 px PNG, single frame. Scene: Indian man ~40s, sitting cross-legged on the ground. Seated figure occupies upper-left region, approximately a 40 × 40 px area (y = 10–50, x = 5–45). Beige kurta (#D2B48C). White dhoti (#F5F5F5). Warm brown skin (#7A4A28). In front of and slightly right of him (x = 35–90, y = 40–80): a wicker basket seen from above as a flat oval brown shape (#8B6914, 50 × 30 px) with a lighter interior (#A07820). Inside the basket: 4 red tomato circles (#CC2200, 8 × 8 px each), 3 pale onion ovals (#D4C27A, 10 × 8 px each), 2 green chili shapes (#228B22, 4 × 12 px thin ovals). Maximum 22 colors."

---

# E — Stray Dog

## E1 — Stray Dog

**Path:** `assets/sprites/npcs/npc-dog.png`

```
PNG size:  300 × 400 px
Grid:      3 columns × 4 rows, each cell 100 × 100 px (12 cells total)

Col 0: idle | Col 1: walk-frame-1 | Col 2: walk-frame-2
Row 0: facing DOWN | Row 1: facing UP | Row 2: facing LEFT | Row 3: facing RIGHT
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 300 × 400 px PNG. Sprite sheet: 3 columns × 4 rows, each cell 100 × 100 px, 12 cells total. All 12 cells filled. Col 0 idle, col 1 walk-frame-1, col 2 walk-frame-2. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Character: friendly Indian street dog (INDog), quadruped. Top-down view — body is a rounded oval (~60 × 44 px) centered in each cell. Tan fur (#C19A6B). Off-white belly patch (#F0EED0) as a lighter oval at the center of the body. Four stubby legs: 8 × 10 px rounded nubs at the four corners of the body oval. Floppy ears (#8B6914, darker): two teardrop shapes drooping outward from the head sides, ~10 × 14 px each. Tail: a 4 × 20 px curved strip extending from the rear, angled upward ~45° in idle. Small black nose dot (4 × 4 px #1A1A1A) at south edge of head in facing-down cell. Walk-frame-1: front-left and rear-right legs extended 8 px outward. Walk-frame-2: front-right and rear-left legs extended. Maximum 18 colors."

---

## Wiring

```ts
// boot-scene.ts preload() — walking NPCs
this.load.spritesheet('npc-chai-wallah',   'assets/sprites/npcs/npc-chai-wallah.png',   { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('npc-cricket-kid',   'assets/sprites/npcs/npc-cricket-kid.png',   { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('npc-laundry-aunty', 'assets/sprites/npcs/npc-laundry-aunty.png', { frameWidth: 100, frameHeight: 100 });

// Stationary vendor
this.load.image('npc-vendor', 'assets/sprites/npcs/npc-vendor.png');

// Stray dog (3-frame walk, 4 directions)
this.load.spritesheet('npc-dog', 'assets/sprites/npcs/npc-dog.png', { frameWidth: 100, frameHeight: 100 });
```
