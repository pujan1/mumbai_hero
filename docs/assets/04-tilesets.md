---
name: Tileset Prompts
description: Generation prompts for all 4 tilesets — Kholi interior, Neighborhood exterior, Train station, House interior
type: reference
---

# F — Tilesets

All tilesets: **100 × 100 px per tile**, transparent PNG, **1000 px wide** (10 tiles per row).

---

## F1 — Kholi Interior Tileset

**Path:** `assets/tilesets/tileset-kholi.png`

```
Output PNG:  1000 × 600 px  (10 columns × 6 rows, 60 tile slots)
```

Tile inventory:

```
Row 0 — Floor & wall bases (tiles 0–9):
  0: Worn cement floor — mid-grey #A8A8A8, diagonal hairline cracks, seamlessly tileable
  1: Floor variant — darker #909090, horizontal crack offset
  2: Floor variant — small corner chip, same grey base
  3: Solid painted wall — faded powder-blue #8AABCC plaster, flat, tileable
  4: Wall with watermark stain — same blue + brownish horizontal stripe
  5: Wall–floor junction — blue wall top 50 px, 8 px dark shadow, grey floor bottom 42 px
  6: Wall corner top-left outer — blue wall on top and left edges meeting at corner
  7: Wall corner top-right outer — mirrored
  8: Open doorway — floor tile, passage gap, no door
  9: Window in wall — metal grill bars #808080 in blue wall, pale light #FFFACD beyond

Row 1 — Doors & small wall items (tiles 10–19):
  10: Closed door — worn wood #6B3A2A, two raised rectangular panels, dark gap at base
  11: Open door — door leaf swung 90° open
  12: Oval mirror — silver frame #C0C0C0 (6 px wide), light-blue interior with highlight glint
  13: Framed family photo — sepia #C8A87A in dark wood frame #4A2C0A on wall
  14: Religious calendar — white paper, red border, on wall
  15: LPG gas cylinder — small red cylinder #CC0000 (20 × 40 px) with white label, against wall
  16: Wall-mounted fan — off-white circular body, 3 dark grey blades
  17: Light switch plate — small cream rectangle on blue wall
  18–19: Transparent (reserved)

Row 2 — Furniture top-halves (tiles 20–29):
  20: Bed top-half — grey metal headboard #808080, light-blue bedsheet #6699CC
  21: Bed top-half variant — orange-floral patterned sheet #E67E22
  22: Wooden side table top — dark brown #4A2C0A, steel cup (silver circle) on surface
  23: 2-burner gas stove top — grey body #666666, two silver burner rings #C0C0C0
  24: Wall-mounted utensil rack (upper) — rail with 3 hanging steel vessels
  25: Wooden chair top-half — ladder-back as two horizontal bars from above
  26: Small plastic stool top-half — light grey flat circle #D0D0D0, 40 px diameter
  27: Stacked folded clothes — mixed colors (blue, beige, white)
  28–29: Transparent (reserved)

Row 3 — Furniture bottom-halves (tiles 30–39):
  30: Bed bottom-half — foot of bed, sheet fold, small white pillow
  31: Bed bottom-half variant — orange-floral sheet foot, pillow
  32: Table bottom-half — dark brown legs on floor
  33: Gas stove bottom-half — stove base on floor
  34: Utensil rack bottom-half — lower shelf with stacked steel plates
  35: Chair bottom-half — seat and four dark legs on floor
  36: Stool bottom-half — three thin grey legs on floor
  37–39: Transparent (reserved)

Rows 4–5: All transparent (reserved)
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 600 px PNG. Tile grid: 10 columns × 6 rows, each tile 100 × 100 px. Arrange tiles left-to-right, top-to-bottom exactly as the inventory above. Row 0: tile 0 worn cement floor mid-grey #A8A8A8 with diagonal hairline cracks, seamlessly tileable; tile 1 floor darker #909090 horizontal crack offset; tile 2 floor with corner chip; tile 3 faded powder-blue #8AABCC plaster wall flat tileable; tile 4 same blue wall with brownish horizontal water-stain stripe; tile 5 wall-floor junction (blue wall top 50px, 8px dark shadow, grey floor bottom 42px); tile 6 outer top-left wall corner; tile 7 outer top-right wall corner (mirrored); tile 8 open doorway (floor tile no door); tile 9 barred window in blue wall (metal grill #808080, pale yellow light #FFFACD beyond bars). Row 1: tile 10 closed wooden door #6B3A2A two raised panels dark gap at base; tile 11 open door leaf swung 90°; tile 12 oval mirror silver frame #C0C0C0 light-blue interior; tile 13 framed sepia family photo in dark wood frame on wall; tile 14 white religious calendar with red border on wall; tile 15 red LPG cylinder #CC0000 with white label leaning against wall; tile 16 off-white wall fan with 3 dark blades; tile 17 cream light-switch plate on wall; tiles 18–19 transparent. Row 2: tile 20 bed top-half grey headboard #808080 light-blue sheet #6699CC; tile 21 bed top orange-floral sheet #E67E22; tile 22 small wooden table top #4A2C0A with steel cup; tile 23 2-burner stove top grey body silver rings; tile 24 wall utensil rack upper with hanging vessels; tile 25 wooden chair ladder-back top-half; tile 26 light-grey stool top circle; tile 27 stacked folded clothes; tiles 28–29 transparent. Row 3: tile 30 bed foot sheet fold pillow; tile 31 bed foot floral variant with pillow; tile 32 table legs on floor; tile 33 stove base on floor; tile 34 utensil rack lower shelf with stacked plates; tile 35 chair seat and four legs; tile 36 stool three-legged base; tiles 37–39 transparent. Rows 4–5: fully transparent. All floor tiles seamlessly tileable. Palette: cool-grey concrete, aged blue-grey walls, warm dark-brown furniture, off-white #F0EEE0 as brightest highlight. Maximum 40 colors total."

---

## F2 — Neighborhood Exterior Tileset

**Path:** `assets/tilesets/tileset-neighborhood.png`

```
Output PNG:  1000 × 800 px  (10 columns × 8 rows, 80 tile slots)
```

Ground palette (must match `neighborhood-scene.ts` `buildWorld()` placeholder colors):
- Grass primary: `#4a7a3d`, park/cricket-ground variant `#5d9944`
- Road / asphalt: `#3d3d4d`
- Road centre-line markings: `#CCCC44`
- Cricket pitch strip: `#a0a870`
- Tree / hedge border: `#2d5a1e`

Map structure this tileset must support — 3×3 block grid (24 cols × 18 rows):
- Two horizontal roads (Road H1 rows 5–6, Road H2 rows 11–12) and two vertical roads (Road V1 cols 7–8, Road V2 cols 15–16)
- Nine building blocks between roads: A1=TrainStation, B1=Bollywood+Music, C1=Textile+Fitness, A2=Kholi/Chawl, B2=Park, C2=Food+Cinema, A3=Market, B3=Office, C3=Residential
- All building doors face a road — doors on south edge of Row-1 blocks, south edge of Row-2 blocks, and north edge of Row-3 blocks

Tile inventory:

```
Row 0 — Ground tiles (0–9):
  0: Grass base — #4A7A3D, subtle 2-px blade dashes in #527A40, seamlessly tileable
  1: Grass variant — different blade pattern, same base color
  2: Park grass — lighter #5D9944, brighter blade dashes, for B2 cricket-ground block
  3: Cricket pitch strip — dusty tan #A0A870, faint horizontal grain, for the pitch tile in B2
  4: Asphalt road — dark #3D3D4D, very faint horizontal grain texture, seamlessly tileable
  5: Road with centre-line dash — asphalt #3D3D4D + single yellow dashed line (CCCC44,
       60 × 5 px dash centered vertically), seamlessly tileable horizontally
  6: Road edge / curb transition — asphalt on south 75 px, 8-px lighter curb strip #7A7A6A,
       grass on north 17 px (for tile rows just north of a horizontal road)
  7: Road edge / curb transition — mirror of tile 6 (grass on south 17 px, curb, asphalt north)
  8: Road intersection — plain asphalt #3D3D4D, no markings (for V-road × H-road junction tiles)
  9: Transparent (reserved)

Row 1 — Border, trees, infrastructure (10–19):
  10: Tree / hedge tile — #2D5A1E base, two round dark-green canopy blobs with 1-px outlines
  11: Tree variant — canopy blobs shifted / offset
  12: Small shrub / bush — medium green #3A7A2A, rounder smaller canopy
  13: Electric pole — dark grey post #606060 (6 px wide) on asphalt tile, wire arms at top
  14: Blue plastic water tank on rooftop — blue rectangle #1A5276 on grey concrete roof tile
  15: Small temple corner — white-washed structure #F5F5F5 with saffron flag #FF8C00 on top
  16: Potted tulsi plant — terracotta pot #CC6633 with bright green leaves #228B22
  17: Faded wall advertisement — cream wall #D4B896 with bold red lettering marks #CC2200
  18: Corrugated iron roofing — silver-grey horizontal ridges #A0A0A0, alternating light/dark stripes
  19: Pedestrian crosswalk — asphalt #3D3D4D with 4 white stripes #F5F5F5 (each 14 × 100 px,
       evenly spaced), for road tiles at block entrances

Row 2 — Building facade tiles (20–29):
  20: Chawl facade base wall — cream-ochre #D4B896 plaster, flat tileable (A2 Kholi block)
  21: Facade with small wooden window frame #4A2C0A (30 × 24 px) in cream wall
  22: Facade with balcony edge — 10 px shadow overhang strip at tile bottom
  23: Train station facade — dark concrete #5A6070, flat tileable (A1 block)
  24: Train station facade with window — dark concrete #5A6070 + blue-tinted window #88AABF
       (50 × 40 px) centered
  25: Cinema facade — near-black #303050, flat tileable (C2 cinema half)
  26: Office facade — blue-grey #9EB0B0, flat tileable (B3 block)
  27: Market / kirana facade — sandy #E8D4A0 with a 12 px colored awning strip at the top
       (alternating red #DD6644 and blue #44AADD 10-px segments)
  28: Generic residential facade — sandy beige #D4C090, flat tileable (C3 block)
  29: Transparent (reserved)

Row 3 — Elder house entrance tiles (30–39):
  30: Bollywood house door — warm sandy facade #D4956A + vibrant film poster (#CC2200 & #FFD700)
       beside dark wood doorframe
  31: Music house entrance — sage-green facade #9EB8A0 + painted musical notes (#1A1A1A) above arch
  32: Textile house entrance — ochre facade #C8A878 + tailor's dress-form silhouette (#D2B48C)
       beside door
  33: Fitness house entrance — blue-grey facade #7898BC + painted dumbbell shape #808080 above door
  34: Food house entrance — vibrant orange facade #D86030 + painted steel thali circle #C0C0C0
       + steam lines above door
  35: Cinema house entrance — dark facade #303050 + vintage camera silhouette #4A4A4A beside door
       + small red marquee strip #FF4444
  36: Locked house door — plain cream facade + dark wooden door + padlock symbol
  37: Kholi door exterior — worn cream-ochre facade #C8A068 + small simple battered door
  38: Train station entrance arch — dark concrete #5A6070 + wide arched gap + "STATION" lettering
       in small cream letters
  39: Transparent (reserved)

Row 4 — Street objects & props (40–49):
  40: Wooden bench on road — dark brown planks #4A2C0A with slat lines on asphalt tile,
       80 × 40 px bench area
  41: Street lamp on road — dark post #606060 with small yellow bulb circle (#FFD700) at top,
       on asphalt tile
  42: Bicycle parked — two wheel circles (#1A1A1A outline, #808080 fill) with frame between,
       leaning against a wall (grass background)
  43: Trash bin on road — green metal cylinder #228B22 (28 × 36 px) with darker lid, on asphalt
  44: Pushcart / handcart — wooden planks #8B6914 (40 × 30 px) with two dark-circle wheels,
       on road
  45: Manhole cover — dark grey circle #606060 (60 px diam.) with cross-hatch grid on asphalt
  46: Bus stop pole — narrow dark post #606060 with blue rectangular sign #0047AB at top
       ("BUS STOP" in 4-px white pixel letters), on asphalt tile
  47: NPC standing shadow spot — grass tile with faint grey shadow circle (20 px diam.)
  48–49: Transparent (reserved)

Rows 5–7: All transparent (reserved)
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 800 px PNG. Tile grid: 10 columns × 8 rows, each tile 100 × 100 px. Arrange tiles left-to-right, top-to-bottom exactly as the inventory above. Row 0 (ground tiles 0–9): tile 0 grass base #4A7A3D seamlessly tileable with subtle 2-px blade dashes in lighter #527A40; tile 1 grass variant different dash pattern; tile 2 park grass #5D9944 brighter green with blade dashes; tile 3 cricket pitch strip #A0A870 dusty tan with faint grain; tile 4 asphalt road #3D3D4D very faint horizontal texture seamlessly tileable; tile 5 road with yellow centre-line dash #CCCC44 (60 × 5 px dash centered) seamlessly tileable horizontally; tile 6 road-edge curb transition (asphalt south 75 px, 8-px curb #7A7A6A, grass north 17 px); tile 7 mirror of tile 6 (grass south, curb, asphalt north); tile 8 road intersection plain asphalt; tile 9 transparent. Row 1 (border and infrastructure tiles 10–19): tile 10 tree hedge #2D5A1E with two round dark-green canopy blobs and 1-px outlines; tile 11 tree variant offset; tile 12 small bush #3A7A2A rounder shape; tile 13 concrete electric pole #606060 on asphalt with wire arms; tile 14 blue water tank #1A5276 on grey roof; tile 15 whitewashed temple corner #F5F5F5 with saffron flag #FF8C00; tile 16 tulsi plant in terracotta pot #CC6633; tile 17 cream wall with faded red ad marks #CC2200; tile 18 corrugated iron roofing silver-grey ridges #A0A0A0; tile 19 pedestrian crosswalk on asphalt (4 white stripes #F5F5F5 each 14 × 100 px). Row 2 (building facade tiles 20–29): tile 20 cream-ochre chawl facade #D4B896 flat wall tileable; tile 21 same with small dark window frame; tile 22 same with 10-px balcony shadow overhang; tile 23 train station dark concrete #5A6070 flat tileable; tile 24 dark concrete with blue-tinted window #88AABF; tile 25 cinema near-black facade #303050; tile 26 office blue-grey facade #9EB0B0; tile 27 market sandy facade #E8D4A0 with colored awning strip; tile 28 residential sandy beige #D4C090 flat; tile 29 transparent. Row 3 (building entrance tiles 30–39): tile 30 Bollywood house warm sandy #D4956A with film poster #CC2200 and #FFD700 beside dark doorframe; tile 31 music house sage-green #9EB8A0 with painted musical notes above arch; tile 32 textile house ochre #C8A878 with tailor dress-form silhouette; tile 33 fitness house blue-grey #7898BC with dumbbell above door; tile 34 food house orange #D86030 with thali circle and steam; tile 35 cinema house dark #303050 with camera silhouette and red marquee; tile 36 locked house with padlock symbol; tile 37 kholi worn cream-ochre #C8A068 with small battered door; tile 38 train station arch dark concrete with arched entrance and STATION lettering; tile 39 transparent. Row 4 (street objects 40–49): tile 40 wooden bench on asphalt dark brown slats; tile 41 street lamp yellow bulb on asphalt; tile 42 parked bicycle on grass; tile 43 green trash bin on asphalt; tile 44 wooden pushcart on road; tile 45 manhole cover grey circle cross-hatch on asphalt; tile 46 bus stop pole with blue sign on asphalt; tile 47 NPC shadow spot on grass; tiles 48–49 transparent. Rows 5–7: fully transparent. All ground and road tiles seamlessly tileable. Maximum 52 colors total. Palette core: warm greens for grass, dark asphalt grey for roads, yellow dashes for road markings, cream-ochre for chawl facades, distinct warm/cool tones for each elder house block, dark concrete for train station."

---

## F3 — Train Station Tileset

**Path:** `assets/tilesets/tileset-train.png`

```
Output PNG:  1000 × 400 px  (10 columns × 4 rows, 40 tile slots)
```

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 400 px PNG. Tile grid: 10 columns × 4 rows, each tile 100 × 100 px. Row 0 (platform tiles 0–9): tile 0 platform floor warm yellow-ochre #D4A843 with subtle 4-px grout lines (#B89030 cross-hatching), seamlessly tileable; tile 1 platform edge tile (south) same ochre with 12-px black-and-yellow #FFD700 caution stripe along south edge; tile 2 platform edge corner; tile 3 platform with center 4-px white stripe running full 100-px width; tile 4 bench on platform (dark brown plank #4A2C0A occupying north 40 px, transparent south 60 px); tile 5 metal support pillar top-down (grey circle #808080, 20-px diameter, centered on ochre platform); tile 6 station signboard (teal-blue #006994 rectangle 80 × 24 px, white horizontal text-line, centered in tile); tiles 7–9 transparent. Row 1 (track tiles 10–19): tile 10 train track center — two parallel dark steel rails (#444444, 6 px wide, 18 px apart) on grey concrete sleepers #A0A0A0 (sleeper rectangles every 20 px), seamlessly tileable horizontally; tile 11 track variant sleeper offset; tile 12 track buffer end (red buffer stop #CC0000, 20 × 14 px block at end of rails); tile 13 overbridge floor grey #909090 with shadow strips on both sides; tile 14 overbridge railing segment blue bar #0047AB (8 px wide, full tile height); tiles 15–19 transparent. Row 2 (train roof tiles for animated train 20–29): tile 20 train carriage roof center — flat orange #E85B00 with 6-px-wide blue center stripe #1A3B8C running full 100-px width horizontally, 4-px darker orange border #B84500 on north and south edges, seamlessly tileable horizontally; tile 21 train cab/nose tile — same orange with 8 ventilation slit lines (1 px dark, 6 px apart) across full height; tile 22 inter-carriage coupling (10-px dark gap #2A2A2A with grey coupling connector squares); tiles 23–29 transparent. Row 3: fully transparent. Maximum 28 colors."

---

## F4 — Elder House Interior Tileset

**Path:** `assets/tilesets/tileset-house.png`

```
Output PNG:  1000 × 600 px  (10 columns × 6 rows, 60 tile slots)
```

Floor / wall reference (must match `BaseIndoorScene` placeholder palette):
- Floor A (lighter checkerboard): `#C4A35A`
- Floor B (darker checkerboard): `#B8943F`
- Wall: very dark teak `#4A2F0D`
- Window: sky-blue `#7AB8D4` in wall
- Inner concave corners (tiles 10–13): required for L-shaped room joins

> "Pixel art, top-down JRPG style (Pokémon FireRed / Golden Sun era quality), vibrant saturated palette, 1-pixel black outlines on object edges, strictly no anti-aliasing, hard pixel edges only. No glow, no shadows, no gradients. Transparent PNG background. Output: exactly 1000 × 600 px PNG. Tile grid: 10 columns × 6 rows, each tile 100 × 100 px. Row 0 (floor and wall bases, tiles 0–9): tile 0 warm honey-wood floor A #C4A35A with subtle horizontal plank grain lines (2-px #B09040 lines every 14 px), seamlessly tileable; tile 1 floor B #B8943F grain lines offset by 7 px to pair with tile 0 in checkerboard, seamlessly tileable; tile 2 dark teak wall #4A2F0D flat solid tileable; tile 3 wall with 6-px picture rail (#6B4420 horizontal strip 14 px from top); tile 4 wall-floor junction (dark teak top 60 px, 6-px shadow #1A0E05, floor A bottom 34 px); tile 5 outer top-left wall corner (teak walls on top and left edges); tile 6 outer top-right wall corner (mirrored); tile 7 open doorway (floor tile, passage gap at wall base); tile 8 closed wooden door #3D1F0D with 2-px brass handle dot #D4A017, set in teak wall; tile 9 wall window — sky-blue pane #7AB8D4 (60 × 44 px) centered in dark teak wall with 4-px black window frame. Row 1 (concave corners and shared furniture tops, tiles 10–19): tile 10 inner concave corner top-left 270° join (dark teak on outer two edges, floor A tile visible in inner 90° quadrant — clean L-room notch); tile 11 inner concave corner top-right (mirror of 10); tile 12 inner concave corner bottom-left; tile 13 inner concave corner bottom-right; tile 14 two-seater sofa back top-half (teal #2E8B8B upholstered back, 80 px wide, 40 px tall in top of tile); tile 15 sofa armrest tile (one end cap, teal with darker side); tile 16 wooden desk top #3D1F0D with small desk lamp (off-white 14-px shade, 4-px yellow bulb dot); tile 17 wall-mounted bookshelf (colorful book spines packed 80 px wide — blue, red, green, yellow, white); tile 18 small side table #6B3A2A with steel glass (16-px silver circle) on top; tile 19 framed certificate on wall (cream paper #F5F0DC in gold frame #D4A017). Row 2 (Bollywood themed decor, tiles 20–29): tile 20 film poster on wall (bold red #CC2200 and gold #FFD700 graphic); tile 21 film reel on shelf (dark grey circle with orange #E85B00 film strip); tile 22 gold award trophy (golden statuette on dark base); tile 23 director's megaphone (grey cone outline); tile 24 clapperboard (black-and-white striped top, white body); tile 25 vintage film projector top-half (dark grey boxy body with round brass lens); tile 26 projector bottom-half (pedestal base); tile 27 rolled film script (white cylinder); tiles 28–29 transparent. Row 3 (Music tiles 30–34, Textile tiles 35–39): tile 30 harmonium top-half (dark brown body #3D1F0D, ivory keys strip #FFFFF0); tile 31 harmonium bottom; tile 32 tanpura instrument (elongated brown gourd #6B3A2A); tile 33 tabla drum pair top-down (two side-by-side brown circles); tile 34 framed concert photograph (sepia tones in gold frame); tile 35 tailor's mannequin top (beige #D2B48C oval torso on thin pole); tile 36 mannequin pole base; tile 37 colorful fabric bolt (rolled magenta #D81B8B cylinder); tile 38 sewing machine top-half (#1A1A1A body with brass flywheel #D4A017); tile 39 sewing machine bottom-half. Row 4 (Fitness tiles 40–44, Food tiles 45–49): tile 40 dumbbell pair top-down (two grey circles #808080 connected by bar); tile 41 rolled yoga mat (purple cylinder end-on #6A0DAD); tile 42 punching bag top (red oval #CC0000); tile 43 punching bag bottom with chain; tile 44 wall mirror (wide horizontal silver strip #C0C0C0); tile 45 kitchen counter top-half (white tile surface #F5F5F5 with green trim); tile 46 counter bottom-half; tile 47 hanging copper pots top-down (two bronze circles #B87333 side by side); tile 48 spice jar row (five small jars: red, yellow, brown, green, orange); tile 49 steel pressure cooker top-down (silver disc with valve). Row 5 (Cinema themed decor, tiles 50–59): tile 50 vintage box camera on shelf (#4A4A4A body, brass lens #D4A017); tile 51 movie clapperboard (black-and-white stripes); tile 52 lighting umbrella top-down (large white/silver circle); tile 53 flat film reel disc top-down; tile 54 framed black-and-white photograph; tile 55 camera tripod top-down (three grey legs converging); tile 56 director's folding chair; tile 57 film award statuette (golden figure); tiles 58–59 transparent. Maximum 52 colors total across entire sheet."

---

## Wiring

```ts
// boot-scene.ts preload()
this.load.spritesheet('tileset-kholi',        'assets/tilesets/tileset-kholi.png',        { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-neighborhood', 'assets/tilesets/tileset-neighborhood.png', { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-train',        'assets/tilesets/tileset-train.png',        { frameWidth: 100, frameHeight: 100 });
this.load.spritesheet('tileset-house',        'assets/tilesets/tileset-house.png',        { frameWidth: 100, frameHeight: 100 });
```
