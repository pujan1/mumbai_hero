---
name: Vehicle Sprites
description: Generation prompts for Mumbai Local Train and BEST Bus (static prop sprites moved by tweens)
type: reference
---

# G — Vehicles / Animated Props

Vehicles are static sprites moved by Phaser tweens. Sized to match the 100 px tile standard.

---

## G1 — Mumbai Local Train Carriage

**Path:** `assets/sprites/objects/prop-train.png`

```
Output PNG:  300 × 100 px  — single top-down carriage frame (3 tiles wide × 1 tile tall)
Load as: this.load.image('prop-train', 'assets/sprites/objects/prop-train.png')
Phaser tweens the sprite across the screen horizontally.
```

> "Pixel art, top-down JRPG style, vibrant saturated palette, 1-pixel black outlines, strictly no anti-aliasing, hard pixel edges only. Transparent PNG background. Output: exactly 300 × 100 px PNG. Single frame: top-down view of one Mumbai suburban local train carriage. The carriage roof fills 290 × 88 px (6 px transparent margin on all sides). Roof surface: flat orange #E85B00 as primary fill. A 10-px-wide royal blue stripe #1A3B8C runs horizontally along the full 290 px width at the vertical center of the roof. A 4-px darker-orange border #B84500 runs along both the north and south edges of the roof rectangle. East end (motorman cab): a 16-px-wide section with 6 ventilation slits (1-px black lines, 6 px apart) and a small grey windscreen (20 × 16 px, dark tinted #5A7A9A). West end (tail): two small red tail-light squares #FF0000 (8 × 8 px) in the corners. No wheels visible (hidden under car). Maximum 14 colors."

---

## G2 — BEST Bus

**Path:** `assets/sprites/objects/prop-bus.png`

```
Output PNG:  200 × 100 px  — single top-down bus frame (2 tiles wide × 1 tile tall)
Load as: this.load.image('prop-bus', 'assets/sprites/objects/prop-bus.png')
Phaser tweens the sprite across the screen horizontally.
```

> "Pixel art, top-down JRPG style, vibrant saturated palette, 1-pixel black outlines, strictly no anti-aliasing, hard pixel edges only. Transparent PNG background. Output: exactly 200 × 100 px PNG. Single frame: top-down view of a Mumbai BEST double-decker bus travelling rightward. Bus roof fills 188 × 78 px (6 px transparent margin). From above: lower deck roof is red #CC0000 occupying the southern 36 px of the roof height. Upper deck roof is off-white cream #F5F0DC occupying the northern 42 px. A 4-px dark-red border #8B0000 runs along both long sides. Right end (front, direction of travel): dark tinted windscreen #5A7A9A (18 × 50 px, slightly trapezoidal). Left end (rear): two small red tail-light squares #FF0000 (8 × 8 px) in the lower-deck corners. 2-px shadow strip #1A1A1A along both long edges. No wheels visible. Maximum 12 colors."

---

## Wiring

```ts
// boot-scene.ts preload()
this.load.image('prop-train', 'assets/sprites/objects/prop-train.png');
this.load.image('prop-bus',   'assets/sprites/objects/prop-bus.png');
```
