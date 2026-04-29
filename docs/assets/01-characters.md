---
name: Player Character Sprites
description: Generation prompts for Player Boy and Player Girl sprite sheets (500×400 px, 100 px tiles)
type: reference
---

# A — Player Character Sprite Sheets

**Sheet grid** — both characters share this layout:

```
PNG size:  500 × 400 px  (5 cols × 4 rows, 20 frames)
Cell size: 100 × 100 px

Row 0 (y=0):    facing DOWN  — col 0: idle | cols 1–4: walk cycle
Row 1 (y=100):  facing UP    — col 0: idle | cols 1–4: walk cycle
Row 2 (y=200):  facing LEFT  — col 0: idle | cols 1–4: walk cycle
Row 3 (y=300):  facing RIGHT — col 0: idle | cols 1–4: walk cycle
```

**Character proportions at 100 × 100 px** (top-down JRPG, slightly overhead perspective):
- ~5 px transparent margin on all sides; character art within a ~90 × 90 px area
- Head: round/oval ~28 × 24 px, centered horizontally at y = 6–30
- Neck + upper torso: y = 30–58 (~52 px wide at shoulders)
- Lower body + legs: y = 58–90
- Walk cycle (4 frames): frame 1 left foot extended ~10 px forward; frame 2 feet together; frame 3 right foot extended; frame 4 feet together
- Facing DOWN: front face — visible eyes, nose, mouth
- Facing UP: back of head only, no face
- Facing LEFT/RIGHT: side profile, one eye, profile nose

---

## A1 — Player Boy

**Path:** `assets/sprites/characters/player-boy.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled — no blank cells. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Column 0 idle, columns 1–4 walk cycle. Character: Indian teenage boy, 18 years old, lean build. Top-down foreshortening — head oval (~28 × 24 px) centered at y = 6–30. Upper torso (~52 px wide at shoulders) from y = 30–58. Legs and feet from y = 58–90. 5 px transparent margin on all sides. Short straight black hair (#1A1A1A) — from above a dark rounded oval covering the top of the head. Warm brown skin (#8B5A2B). Outfit: sky-blue round-neck T-shirt (#5B9BD5), dark navy jeans (#1A2744), worn grey sneakers (#9B9B9B). Facing-down idle (col 0 row 0): front face — two brown eyes with 4 × 4 px black pupils and small white highlights, tiny nose dot (#8B5A2B deeper), a small curved smile. Walk-down frames (cols 1–4 row 0): left leg swings forward frame 1, both feet together frame 2, right leg swings forward frame 3, both feet together frame 4; arms swing slightly opposite to leg. Row 1 facing-up: back of head (black hair oval), back of blue T-shirt, jeans, shoes — no face. Rows 2–3 facing-left/right: side profile, one visible eye, 2-px nose bump, side of hair. Maximum 32 colors across entire sheet."

---

## A2 — Player Girl

**Path:** `assets/sprites/characters/player-girl.png`

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on all edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Sprite sheet: 5 columns × 4 rows, each cell 100 × 100 px, 20 cells total. All 20 cells filled. Row 0 facing-down, row 1 facing-up, row 2 facing-left, row 3 facing-right. Column 0 idle, columns 1–4 walk cycle. Character: Indian teenage girl, 18 years old, slim build. Same proportions as boy: head oval y = 6–30, torso y = 30–58, legs y = 58–90, 5 px transparent margin. Long straight black hair (#1A1A1A) in a low ponytail — from above an elongated dark oval at the top of the head with a 4-px-wide tail extending from the south edge to y = 50. Warm brown skin (#8B5A2B). Outfit: mustard-yellow kurti (#D4A017) reaching to mid-thigh (covers most torso in yellow), dark grey leggings (#333333) visible as two narrow dark columns below the kurti hem, flat brown sandals (#A0522D). Facing-down idle: gentle eyes slightly wider-set than boy, soft 4-px smile. Walk-down frames: legging-covered legs alternate beneath the kurti hem; kurti hem sways slightly left/right each frame. Facing-up: ponytail hangs down the center back. Rows 2–3: side profile with ponytail visible on the far side. Maximum 32 colors."

---

## Wiring

```ts
// boot-scene.ts preload()
this.load.spritesheet('player-boy',  'assets/sprites/characters/player-boy.png',  { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('player-girl', 'assets/sprites/characters/player-girl.png', { frameWidth: 100, frameHeight: 100 });
```

Frame index map:
- 0 = idle-down, 1–4 = walk-down
- 5 = idle-up, 6–9 = walk-up
- 10 = idle-left, 11–14 = walk-left
- 15 = idle-right, 16–19 = walk-right
