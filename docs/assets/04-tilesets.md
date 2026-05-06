---
name: Tileset Prompts
description: Generation prompts for all split tilesets — max 500×500 px (5×5 tiles) per sheet
type: reference
---

# F — Tilesets

All tilesets: **100 × 100 px per tile**, transparent PNG.  
**Max sheet size: 500 × 500 px (5 cols × 5 rows, 25 tiles).**

The original 10-column layouts are split into thematic sheets of ≤ 5 columns.  
Frame indices restart from 0 on each sheet.

---

## F1 — Kholi Interior Tileset

### F1a — tileset-kholi-a.png

**Path:** `assets/tilesets/tileset-kholi-a.png`

```
Output PNG:  500 × 400 px  (5 cols × 4 rows, 20 tiles)

Frame map:
  0: worn cement floor          1: floor variant (darker)       2: floor (corner chip)
  3: powder-blue wall           4: wall + watermark stain
  5: closed wooden door         6: open door (90° swung)        7: oval mirror
  8: framed family photo        9: religious calendar
 10: bed top-half (grey)       11: bed top-half (floral)       12: side table top
 13: gas stove top             14: utensil rack (upper)
 15: bed bottom-half (grey)   16: bed bottom-half (floral)    17: table legs on floor
 18: stove base on floor       19: utensil rack (lower shelf)
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Tile grid: 5 columns × 4 rows, each tile 100 × 100 px. Arrange tiles left-to-right, top-to-bottom. Row 0 (floor and wall base, tiles 0–4): tile 0 worn cement floor mid-grey #A8A8A8 with diagonal hairline cracks, seamlessly tileable; tile 1 floor darker #909090 horizontal crack offset; tile 2 floor with small corner chip same grey base; tile 3 faded powder-blue #8AABCC plaster wall flat tileable; tile 4 same blue wall with brownish horizontal water-stain stripe. Row 1 (doors and wall decor, tiles 5–9): tile 5 closed wooden door #6B3A2A two raised rectangular panels dark gap at base; tile 6 open door leaf swung 90°; tile 7 oval mirror silver frame #C0C0C0 (6 px wide) light-blue interior with highlight glint; tile 8 framed sepia family photo #C8A87A in dark wood frame #4A2C0A on wall; tile 9 white religious calendar with red border on wall. Row 2 (furniture top-halves, tiles 10–14): tile 10 bed top-half grey metal headboard #808080 light-blue bedsheet #6699CC; tile 11 bed top orange-floral patterned sheet #E67E22; tile 12 small wooden side table top #4A2C0A with steel cup (silver circle) on surface; tile 13 2-burner gas stove top grey body #666666 two silver burner rings #C0C0C0; tile 14 wall-mounted utensil rack upper with 3 hanging steel vessels. Row 3 (furniture bottom-halves, tiles 15–19): tile 15 bed foot sheet fold small white pillow; tile 16 bed foot orange-floral with pillow; tile 17 dark brown table legs on floor; tile 18 stove base on floor; tile 19 utensil rack lower shelf with stacked steel plates. All floor tiles seamlessly tileable. Palette: cool-grey concrete, aged blue-grey walls, warm dark-brown furniture. Maximum 36 colors."

---

### F1b — tileset-kholi-b.png

**Path:** `assets/tilesets/tileset-kholi-b.png`

```
Output PNG:  500 × 400 px  (5 cols × 4 rows, 20 tiles)

Frame map:
  0: wall-floor junction        1: outer corner top-left        2: outer corner top-right
  3: open doorway (no door)     4: barred window in wall
  5: LPG gas cylinder           6: wall-mounted fan             7: light switch plate
  8: transparent (reserved)     9: transparent (reserved)
 10: wooden chair top-half     11: plastic stool top-half      12: stacked folded clothes
 13: transparent (reserved)    14: transparent (reserved)
 15: chair bottom-half         16: stool bottom-half           17–19: transparent
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 400 px PNG. Tile grid: 5 columns × 4 rows, each tile 100 × 100 px. Row 0 (wall architectural tiles, tiles 0–4): tile 0 wall-floor junction (blue wall top 50 px, 8-px dark shadow, grey floor bottom 42 px); tile 1 outer top-left wall corner (blue wall on top and left edges meeting at corner); tile 2 outer top-right wall corner (mirrored); tile 3 open doorway — floor tile only, passage gap, no door; tile 4 barred window in blue wall — metal grill bars #808080 in blue wall, pale light #FFFACD beyond. Row 1 (small wall items, tiles 5–9): tile 5 red LPG gas cylinder #CC0000 (20 × 40 px) with white label leaning against wall; tile 6 off-white wall-mounted fan circular body with 3 dark grey blades; tile 7 cream light-switch plate on blue wall; tiles 8–9 transparent. Row 2 (chair and stool tops, tiles 10–14): tile 10 wooden chair top-half — ladder-back as two horizontal bars from above; tile 11 light-grey plastic stool top-half — flat circle #D0D0D0 40 px diameter; tile 12 stacked folded clothes mixed colors (blue, beige, white); tiles 13–14 transparent. Row 3 (chair and stool bottoms, tiles 15–19): tile 15 chair seat and four dark legs on floor; tile 16 three thin grey stool legs on floor; tiles 17–19 transparent. Maximum 28 colors."

---

### Wiring — Kholi

```ts
this.load.spritesheet('tileset-kholi-a', 'assets/tilesets/tileset-kholi-a.png', { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-kholi-b', 'assets/tilesets/tileset-kholi-b.png', { frameWidth: 100, frameHeight: 100 });
```

---

## F2 — Neighborhood Exterior Tileset

Ground palette (must match `neighborhood-scene.ts` `buildWorld()` placeholder colors):
- Grass primary: `#4a7a3d`, park/cricket-ground variant `#5d9944`
- Road / asphalt: `#3d3d4d`
- Road centre-line markings: `#CCCC44`

### F2a — tileset-neighborhood-a.png

**Path:** `assets/tilesets/tileset-neighborhood-a.png`

```
Output PNG:  500 × 500 px  (5 cols × 5 rows, 25 tiles)

Frame map:
  0: grass base            1: grass variant         2: park grass           3: cricket pitch strip   4: asphalt road
  5: tree / hedge          6: tree variant           7: small shrub          8: electric pole         9: rooftop water tank
 10: chawl facade base    11: chawl + window        12: chawl + balcony     13: station facade       14: station + window
 15: bollywood entrance   16: music entrance        17: textile entrance    18: fitness entrance     19: food entrance
 20: wooden bench         21: street lamp           22: bicycle parked      23: trash bin            24: pushcart
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 500 px PNG. Tile grid: 5 columns × 5 rows, each tile 100 × 100 px. Row 0 (ground tiles): tile 0 grass base #4A7A3D seamlessly tileable with subtle 2-px blade dashes in lighter #527A40; tile 1 grass variant different dash pattern same base; tile 2 park grass #5D9944 brighter green blade dashes; tile 3 cricket pitch strip #A0A870 dusty tan with faint horizontal grain; tile 4 asphalt road #3D3D4D very faint horizontal texture seamlessly tileable. Row 1 (border and infrastructure): tile 5 tree hedge #2D5A1E with two round dark-green canopy blobs and 1-px outlines; tile 6 tree variant offset canopy blobs; tile 7 small bush #3A7A2A rounder smaller canopy; tile 8 concrete electric pole #606060 (6 px wide) on asphalt tile with wire arms at top; tile 9 blue rooftop water tank #1A5276 on grey concrete roof tile. Row 2 (building facades): tile 10 cream-ochre chawl facade #D4B896 flat wall tileable; tile 11 chawl facade with small dark window frame #4A2C0A (30 × 24 px); tile 12 chawl facade with 10-px balcony shadow overhang strip at bottom; tile 13 train station dark concrete facade #5A6070 flat tileable; tile 14 station facade with blue-tinted window #88AABF (50 × 40 px) centered. Row 3 (elder house entrances): tile 15 Bollywood house warm sandy #D4956A with film poster (#CC2200 and #FFD700) beside dark doorframe; tile 16 music house sage-green #9EB8A0 with painted musical notes above arch; tile 17 textile house ochre #C8A878 with tailor dress-form silhouette beside door; tile 18 fitness house blue-grey #7898BC with dumbbell shape above door; tile 19 food house orange #D86030 with steel thali circle and steam lines above door. Row 4 (street objects): tile 20 wooden bench on asphalt dark brown planks #4A2C0A (80 × 40 px); tile 21 street lamp dark post #606060 with yellow bulb circle #FFD700 on asphalt; tile 22 parked bicycle two wheel circles (#1A1A1A outline #808080 fill) on grass; tile 23 green trash bin #228B22 (28 × 36 px) with darker lid on asphalt; tile 24 wooden pushcart #8B6914 (40 × 30 px) with two dark-circle wheels on road. All ground tiles seamlessly tileable. Maximum 44 colors."

---

### F2b — tileset-neighborhood-b.png

**Path:** `assets/tilesets/tileset-neighborhood-b.png`

```
Output PNG:  500 × 500 px  (5 cols × 5 rows, 25 tiles)

Frame map:
  0: road + centre-line dash    1: road edge (curb, grass south)  2: road edge (curb, grass north)  3: road intersection   4: transparent
  5: small temple corner        6: potted tulsi plant             7: faded wall advertisement        8: corrugated iron roofing  9: pedestrian crosswalk
 10: cinema facade             11: office facade                 12: market facade                 13: residential facade  14: transparent
 15: cinema house entrance     16: locked house door             17: kholi door exterior           18: station arch        19: transparent
 20: manhole cover             21: bus stop pole                 22: NPC shadow spot               23–24: transparent
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 500 px PNG. Tile grid: 5 columns × 5 rows, each tile 100 × 100 px. Row 0 (road tiles): tile 0 asphalt road #3D3D4D with yellow centre-line dash #CCCC44 (60 × 5 px dash centered) seamlessly tileable horizontally; tile 1 road-edge curb transition (asphalt south 75 px, 8-px curb #7A7A6A, grass north 17 px); tile 2 mirror of tile 1 (grass south 17 px, curb, asphalt north 75 px); tile 3 road intersection plain asphalt #3D3D4D; tile 4 transparent. Row 1 (props and infrastructure): tile 5 whitewashed temple corner structure #F5F5F5 with saffron flag #FF8C00 on top; tile 6 tulsi plant in terracotta pot #CC6633 with bright green leaves #228B22; tile 7 cream wall #D4B896 with faded red advertisement marks #CC2200; tile 8 corrugated iron roofing silver-grey horizontal ridges #A0A0A0; tile 9 pedestrian crosswalk on asphalt (4 white stripes #F5F5F5 each 14 × 100 px evenly spaced). Row 2 (more facades): tile 10 cinema near-black facade #303050 flat tileable; tile 11 office blue-grey facade #9EB0B0 flat tileable; tile 12 market sandy facade #E8D4A0 with colored awning strip (alternating red #DD6644 and blue #44AADD 10-px segments) at top; tile 13 residential sandy beige #D4C090 flat tileable; tile 14 transparent. Row 3 (remaining entrances): tile 15 cinema house dark #303050 with vintage camera silhouette #4A4A4A and small red marquee #FF4444; tile 16 plain cream facade with dark locked door and padlock symbol; tile 17 worn cream-ochre facade #C8A068 with small battered kholi door; tile 18 train station arch dark concrete #5A6070 with wide arched entrance and STATION lettering in small cream letters; tile 19 transparent. Row 4 (street props): tile 20 grey manhole cover circle #606060 (60 px diam.) with cross-hatch grid on asphalt; tile 21 narrow bus stop pole #606060 with blue rectangular sign #0047AB (BUS STOP in 4-px white pixel letters) on asphalt; tile 22 grass tile with faint grey NPC shadow circle (20 px diam.); tiles 23–24 transparent. Maximum 44 colors."

---

### Wiring — Neighborhood

```ts
this.load.spritesheet('tileset-neighborhood-a', 'assets/tilesets/tileset-neighborhood-a.png', { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-neighborhood-b', 'assets/tilesets/tileset-neighborhood-b.png', { frameWidth: 100, frameHeight: 100 });
```

---

## F3 — Train Station Tileset

All 15 actual tiles reorganized into a single 500 × 300 px sheet.

### F3 — tileset-train.png

**Path:** `assets/tilesets/tileset-train.png`

```
Output PNG:  500 × 300 px  (5 cols × 3 rows, 15 tiles)

Frame map:
  0: platform floor (warm ochre)   1: platform floor variant   2: platform edge (caution stripe)   3: platform edge corner   4: platform + center stripe
  5: bench on platform             6: metal support pillar      7: station signboard               8: track center (rails + sleepers)  9: track variant
 10: track buffer end             11: overbridge floor          12: overbridge railing segment    13: train carriage roof center    14: train cab/nose
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 300 px PNG. Tile grid: 5 columns × 3 rows, each tile 100 × 100 px. Row 0 (platform surface tiles): tile 0 platform floor warm yellow-ochre #D4A843 with subtle 4-px grout lines (#B89030 cross-hatching) seamlessly tileable; tile 1 platform floor variant with grout offset; tile 2 platform south edge — same ochre with 12-px black-and-yellow #FFD700 caution stripe along south edge; tile 3 platform edge corner tile; tile 4 platform with center 4-px white stripe running full 100-px width. Row 1 (platform furniture and signage): tile 5 dark brown bench on platform (#4A2C0A plank, occupying north 40 px, transparent south 60 px); tile 6 grey metal support pillar top-down — circle #808080 20 px diameter centered on ochre; tile 7 station signboard — teal-blue #006994 rectangle 80 × 24 px with white horizontal text-line centered in tile; tile 8 train track center — two parallel dark steel rails (#444444, 6 px wide, 18 px apart) on grey concrete sleepers #A0A0A0 (sleeper rectangles every 20 px) seamlessly tileable horizontally; tile 9 track variant with sleeper offset. Row 2 (track end and overbridge): tile 10 track buffer end — red buffer stop #CC0000 (20 × 14 px block) at end of rails; tile 11 overbridge floor grey #909090 with shadow strips on both sides; tile 12 overbridge railing segment blue bar #0047AB (8 px wide, full tile height); tile 13 train carriage roof center — flat orange #E85B00 with 6-px royal blue center stripe #1A3B8C running full width, 4-px darker-orange border #B84500 on north and south edges, seamlessly tileable horizontally; tile 14 train cab/nose — same orange with 8 ventilation slit lines across full height. Maximum 26 colors."

---

### Wiring — Train

```ts
this.load.spritesheet('tileset-train', 'assets/tilesets/tileset-train.png', { frameWidth: 100, frameHeight: 100 });
```

---

## F4 — Elder House Interior Tileset

Split into 5 thematic sheets to keep each under 500 × 500 px and focused for AI generation.

Floor / wall reference (must match `BaseIndoorScene` placeholder palette):
- Floor A (lighter): `#C4A35A`
- Floor B (darker): `#B8943F`
- Wall: very dark teak `#4A2F0D`
- Window: sky-blue `#7AB8D4` in wall

---

### F4a — tileset-house-arch.png

**Path:** `assets/tilesets/tileset-house-arch.png`

```
Output PNG:  500 × 300 px  (5 cols × 3 rows, 15 tiles)

Frame map:
  0: floor A (honey-wood)    1: floor B (checker pair)   2: teak wall base    3: wall + picture rail    4: wall-floor junction
  5: outer corner top-left   6: outer corner top-right   7: open doorway      8: closed wooden door     9: wall window (sky-blue)
 10: inner concave TL       11: inner concave TR         12: inner concave BL 13: inner concave BR      14: transparent
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 300 px PNG. Tile grid: 5 columns × 3 rows, each tile 100 × 100 px. Row 0 (floor and wall bases): tile 0 warm honey-wood floor A #C4A35A with subtle horizontal plank grain lines (2-px #B09040 every 14 px) seamlessly tileable; tile 1 floor B #B8943F grain lines offset by 7 px to pair with tile 0 in checkerboard seamlessly tileable; tile 2 dark teak wall #4A2F0D flat solid tileable; tile 3 teak wall with 6-px picture rail (#6B4420 horizontal strip 14 px from top); tile 4 wall-floor junction (dark teak top 60 px, 6-px shadow #1A0E05, floor A bottom 34 px). Row 1 (corners and doors): tile 5 outer top-left wall corner (teak walls on top and left edges meeting cleanly); tile 6 outer top-right wall corner (mirrored); tile 7 open doorway (floor tile with passage gap at wall base); tile 8 closed wooden door #3D1F0D with 2-px brass handle dot #D4A017 set in teak wall; tile 9 wall window — sky-blue pane #7AB8D4 (60 × 44 px) centered in dark teak wall with 4-px black frame. Row 2 (L-room concave corners): tile 10 inner concave corner top-left 270° join (teak on outer two edges, floor A visible in inner quadrant); tile 11 inner concave corner top-right (mirror of 10); tile 12 inner concave corner bottom-left; tile 13 inner concave corner bottom-right; tile 14 transparent. Maximum 20 colors."

---

### F4b — tileset-house-shared.png

**Path:** `assets/tilesets/tileset-house-shared.png`

```
Output PNG:  500 × 300 px  (5 cols × 3 rows, 15 tiles)

Frame map:
  0: sofa back top-half    1: sofa armrest     2: wooden desk + lamp   3: wall bookshelf    4: small side table
  5: framed certificate    6: film poster      7: film reel on shelf   8: gold award trophy 9: director's megaphone
 10: clapperboard         11: projector top   12: projector bottom    13: rolled film script  14: transparent
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 300 px PNG. Tile grid: 5 columns × 3 rows, each tile 100 × 100 px. Row 0 (shared furniture): tile 0 two-seater sofa back top-half — teal #2E8B8B upholstered back 80 px wide 40 px tall in top of tile; tile 1 sofa armrest one end cap teal with darker side; tile 2 wooden desk top #3D1F0D with small desk lamp (off-white 14-px shade, 4-px yellow bulb dot); tile 3 wall-mounted bookshelf — colorful book spines packed 80 px wide (blue, red, green, yellow, white); tile 4 small wooden side table #6B3A2A with steel glass (16-px silver circle) on top. Row 1 (wall decor and Bollywood props): tile 5 framed certificate — cream paper #F5F0DC in gold frame #D4A017 on wall; tile 6 film poster on wall — bold red #CC2200 and gold #FFD700 graphic; tile 7 film reel on shelf — dark grey circle with orange #E85B00 film strip; tile 8 gold award trophy — golden statuette on dark base; tile 9 director's megaphone — grey cone outline. Row 2 (more Bollywood props): tile 10 clapperboard — black-and-white striped top, white body; tile 11 vintage film projector top-half — dark grey boxy body with round brass lens; tile 12 projector bottom-half pedestal base; tile 13 rolled white film script cylinder; tile 14 transparent. Maximum 32 colors."

---

### F4c — tileset-house-music-textile.png

**Path:** `assets/tilesets/tileset-house-music-textile.png`

```
Output PNG:  500 × 200 px  (5 cols × 2 rows, 10 tiles)

Frame map:
  0: harmonium top-half    1: harmonium bottom    2: tanpura instrument   3: tabla drum pair   4: concert photograph
  5: mannequin top         6: mannequin pole base 7: fabric bolt          8: sewing machine top 9: sewing machine bottom
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 200 px PNG. Tile grid: 5 columns × 2 rows, each tile 100 × 100 px. Row 0 (music room decor): tile 0 harmonium top-half — dark brown body #3D1F0D with ivory keys strip #FFFFF0; tile 1 harmonium bottom-half — pedestal base with bellows; tile 2 tanpura instrument — elongated brown gourd #6B3A2A with string detail; tile 3 tabla drum pair top-down — two side-by-side brown circles on floor; tile 4 framed concert photograph — sepia tones in gold frame #D4A017 on wall. Row 1 (textile room decor): tile 5 tailor's mannequin top-half — beige #D2B48C oval torso on thin pole; tile 6 mannequin pole base on floor; tile 7 colorful fabric bolt — rolled magenta #D81B8B cylinder on shelf; tile 8 black sewing machine top-half #1A1A1A with brass flywheel #D4A017; tile 9 sewing machine bottom-half on stand. Maximum 28 colors."

---

### F4d — tileset-house-fitness-food.png

**Path:** `assets/tilesets/tileset-house-fitness-food.png`

```
Output PNG:  500 × 200 px  (5 cols × 2 rows, 10 tiles)

Frame map:
  0: dumbbell pair      1: rolled yoga mat     2: punching bag top   3: punching bag bottom + chain   4: wide wall mirror
  5: kitchen counter top 6: counter bottom     7: copper pots        8: spice jar row                 9: pressure cooker
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 200 px PNG. Tile grid: 5 columns × 2 rows, each tile 100 × 100 px. Row 0 (fitness room decor): tile 0 dumbbell pair top-down — two grey circles #808080 connected by bar; tile 1 rolled yoga mat — purple cylinder end-on #6A0DAD; tile 2 punching bag top — red oval #CC0000; tile 3 punching bag bottom with chain detail; tile 4 wide wall mirror — wide horizontal silver strip #C0C0C0. Row 1 (food room decor): tile 5 kitchen counter top-half — white tile surface #F5F5F5 with green trim; tile 6 kitchen counter bottom-half; tile 7 hanging copper pots top-down — two bronze circles #B87333 side by side; tile 8 spice jar row — five small labeled jars (red, yellow, brown, green, orange); tile 9 steel pressure cooker top-down — silver disc #C0C0C0 with center valve dot. Maximum 24 colors."

---

### F4e — tileset-house-cinema.png

**Path:** `assets/tilesets/tileset-house-cinema.png`

```
Output PNG:  500 × 200 px  (5 cols × 2 rows, 10 tiles)

Frame map:
  0: vintage box camera    1: movie clapperboard   2: lighting umbrella top-down   3: flat film reel disc   4: BW photograph
  5: camera tripod         6: director's chair     7: film award statuette          8–9: transparent
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 500 × 200 px PNG. Tile grid: 5 columns × 2 rows, each tile 100 × 100 px. Row 0 (cinema props): tile 0 vintage box camera on shelf — #4A4A4A body, brass lens #D4A017; tile 1 movie clapperboard — black-and-white striped top, white body; tile 2 lighting umbrella top-down — large white/silver circle; tile 3 flat film reel disc top-down — dark grey circle with spoke pattern; tile 4 framed black-and-white photograph on wall. Row 1 (more cinema props): tile 5 camera tripod top-down — three grey legs converging to center; tile 6 director's folding chair top-down — dark frame with canvas seat; tile 7 film award golden statuette on base; tiles 8–9 transparent. Maximum 20 colors."

---

### Wiring — House

```ts
this.load.spritesheet('tileset-house-arch',          'assets/tilesets/tileset-house-arch.png',          { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-house-shared',         'assets/tilesets/tileset-house-shared.png',         { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-house-music-textile',  'assets/tilesets/tileset-house-music-textile.png',  { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-house-fitness-food',   'assets/tilesets/tileset-house-fitness-food.png',   { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-house-cinema',         'assets/tilesets/tileset-house-cinema.png',         { frameWidth: 100, frameHeight: 100 });
```

---

## Tiled Map Notes

Each TMJ file references tilesets by name. With split sheets, each map will include multiple
tileset entries (one per sheet), each with its own `firstgid` offset. Frame indices above
are **local** (start at 0 per sheet); the Tiled GID for any tile = `firstgid + local_frame`.

Scene-to-tileset mapping:
- `kholi-interior-scene` → kholi-a + kholi-b
- `neighborhood-scene` → neighborhood-a + neighborhood-b
- All house scenes → house-arch + house-shared + (room-specific sheet)
  - bollywood → house-arch + house-shared
  - music → house-arch + house-music-textile
  - textile → house-arch + house-music-textile
  - fitness → house-arch + house-fitness-food
  - food → house-arch + house-fitness-food
  - cinema → house-arch + house-cinema
