import { BaseOutdoorScene } from '../base-outdoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import { TILE_SIZE } from '../../config/constants.js';
import { getFastTravelNodes } from '../../systems/fast-travel-system.js';
import type { DialogueTree } from '@mumbai-hero/shared';
import { comingSoonDialogue, lockedDialogue, ambientDialogues } from '../../data/dialogues/index.js';

// ─── Grid layout (24 cols × 18 rows, each tile = TILE_SIZE px) ───────────────
//
//  Col:  0  | 1──6  | 7─8  | 9──14 | 15─16 | 17──22 | 23
//           | BlkA  | RdV1 | BlkB  | RdV2  | BlkC   | border
//
//  Row 0  : border trees
//  Row 1-4: Block Row 1  →  A1=TrainStation  B1=Bollywood+Music  C1=Textile+Fitness
//  Row 5-6: Road H1 (horizontal)
//  Row 7-10: Block Row 2  →  A2=Kholi  B2=Park  C2=Food+Cinema
//  Row 11-12: Road H2 (horizontal)
//  Row 13-16: Block Row 3  →  A3=Market  B3=Office  C3=Residential
//  Row 17 : border trees
// ─────────────────────────────────────────────────────────────────────────────

export class NeighborhoodScene extends BaseOutdoorScene {
  constructor() {
    super({ key: 'neighborhood-scene' });
  }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-neighborhood',
      tilesetKeys: ['tileset-neighborhood-a', 'tileset-neighborhood-b'],
      tilesetNames: ['neighborhood-a', 'neighborhood-b'],
      spawnPoints: {
        // On Road H2, just outside the kholi door
        default:          { x: 3, y: 11 },
        // Return after exiting kholi — same road tile
        'kholi-door':     { x: 3, y: 11 },
        // Returns from Row-1 houses — on Road H1, directly in front of their doors
        'from-bollywood': { x: 10, y: 5 },
        'from-music':     { x: 13, y: 5 },
        'from-textile':   { x: 18, y: 5 },
        'from-fitness':   { x: 21, y: 5 },
        // Returns from Row-2 houses — on Road H2, directly in front of their doors
        'from-food':      { x: 18, y: 11 },
        'from-cinema':    { x: 21, y: 11 },
      },
      sceneId: 'neighborhood-scene',
    };
  }

  // ── NPCs ────────────────────────────────────────────────────────────────────

  spawnNPCs(): void {
    // Chai Wallah on Road H1 near the station entrance — sells chai cups.
    this.addNPC(4, 6, 'ambient-chai-wallah', 'Chai Wallah', 'npc-chai-wallah',
      ambientDialogues['ambient-chai']!,
      {
        inventory: [{ itemId: 'chai', quantity: 30 }],
        shop: {
          shopName: 'Chai Stall',
          sells: ['chai'],
          buys: [],
        },
      },
    );
    // Cricket Kid inside the B2 park
    this.addNPC(11, 9, 'ambient-cricket-kid', 'Cricket Kid', 'npc-cricket-kid', ambientDialogues['ambient-cricket']!);
    // Laundry Aunty in C3 residential block
    this.addNPC(20, 14, 'ambient-laundry-aunty', 'Laundry Aunty', 'npc-laundry-aunty', ambientDialogues['ambient-laundry']!);
    // Vegetable Vendor on Road H2 near the market — full produce shop.
    this.addNPC(5, 12, 'ambient-vendor', 'Vegetable Vendor', 'npc-vendor',
      ambientDialogues['ambient-vendor']!,
      {
        inventory: [
          { itemId: 'tomato', quantity: 40 },
          { itemId: 'onion',  quantity: 40 },
          { itemId: 'potato', quantity: 40 },
          { itemId: 'chili',  quantity: 30 },
        ],
        shop: {
          shopName: 'Tomato Cart',
          sells: ['tomato', 'onion', 'potato', 'chili'],
          buys: ['tomato', 'onion', 'potato', 'chili'],
        },
      },
    );
    // Street Dog in B2 park
    this.addNPC(12, 8, 'ambient-dog', 'Street Dog', 'npc-dog', ambientDialogues['ambient-dog']!);
    // Kirana Shopkeeper standing in front of the kirana awning on Road H2.
    // Stocks staples + sells backpack upgrades.
    this.addNPC(2, 12, 'shop-kirana', 'Kirana Bhai', 'npc-vendor',
      ambientDialogues['ambient-vendor']!,
      {
        inventory: [
          { itemId: 'rice', quantity: 20 },
          { itemId: 'oil',  quantity: 10 },
          { itemId: 'soap', quantity: 25 },
          { itemId: 'backpack-medium', quantity: 1 },
          { itemId: 'backpack-large',  quantity: 1 },
        ],
        shop: {
          shopName: 'Kirana Store',
          sells: ['rice', 'oil', 'soap', 'backpack-medium', 'backpack-large'],
          buys: ['rice', 'oil', 'soap'],
        },
      },
    );
  }

  // ── Interactables / Doors ───────────────────────────────────────────────────

  spawnInteractables(): void {
    // Kholi — south face of A2, opens onto Road H2
    this.addDoor(3, 10, 'kholi-door-ext', { sceneId: 'kholi-interior-scene', spawnPoint: 'from-door' });

    // Row-1 houses — south face of each sub-block, opens onto Road H1
    this.addDoor(10, 4, 'house-bollywood-door', { sceneId: 'house-bollywood-scene', spawnPoint: 'default' });
    this.addDoor(13, 4, 'house-music-door',     { sceneId: 'house-music-scene',     spawnPoint: 'default' });
    this.addDoor(18, 4, 'house-textile-door',   { sceneId: 'house-textile-scene',   spawnPoint: 'default' });
    this.addDoor(21, 4, 'house-fitness-door',   { sceneId: 'house-fitness-scene',   spawnPoint: 'default' });

    // Row-2 houses — south face of C2, opens onto Road H2
    this.addDoor(18, 10, 'house-food-door',   { sceneId: 'house-food-scene',   spawnPoint: 'default' });
    this.addDoor(21, 10, 'house-cinema-door', { sceneId: 'house-cinema-scene', spawnPoint: 'default' });

    // Row-3 buildings — north face of each block, opens onto Road H2
    this.addInteractable(2,  13, 'building-shop-1',    'Kirana Store', comingSoonDialogue);
    this.addInteractable(5,  13, 'building-shop-2',    'Medical',      comingSoonDialogue);
    this.addInteractable(11, 13, 'building-office-1',  'Office',       comingSoonDialogue);
    this.addInteractable(19, 13, 'building-unknown-1', 'House',        lockedDialogue);

    this.addFastTravelTriggers();
  }

  private addFastTravelTriggers(): void {
    getFastTravelNodes().forEach((node) => {
      const stubTree: DialogueTree = {
        id: `fast-travel-${node.id}`,
        startNode: 'start',
        nodes: [{ id: 'start', lines: [{ speaker: '', text: node.stubDialogue }] }],
      };
      this.addInteractable(node.tileX, node.tileY, node.id, node.label, stubTree);
    });
  }

  // ── World creation ──────────────────────────────────────────────────────────

  create(data: { spawnPoint?: string }): void {
    super.create(data);
    this.addTrainAnimation();
    this.addBusAnimation();
  }

  // Override BaseOutdoorScene's buildWorld with the full 3×3 grid
  protected buildWorld(): void {
    const COLS = 24;
    const ROWS = 18;
    const W    = COLS * TILE_SIZE;
    const H    = ROWS * TILE_SIZE;
    const T    = TILE_SIZE;

    // Helper: fill a single tile with a colour
    const tile = (c: number, r: number, color: number, depth = 0) =>
      this.add.rectangle(c * T + T / 2, r * T + T / 2, T, T, color).setDepth(depth);

    // Helper: fill a rectangular block of tiles
    const block = (c1: number, r1: number, c2: number, r2: number, color: number, depth = 0) => {
      const bw = (c2 - c1 + 1) * T;
      const bh = (r2 - r1 + 1) * T;
      return this.add
        .rectangle(c1 * T + bw / 2, r1 * T + bh / 2, bw, bh, color)
        .setDepth(depth);
    };

    // ── Palette ───────────────────────────────────────────────────────────────
    const GRASS       = 0x4a7a3d;
    const ROAD        = 0x3d3d4d;
    const ROAD_DASH   = 0xCCCC44;
    const PARK_GRASS  = 0x5d9944;
    const PARK_PITCH  = 0xa0a870;
    const TREE_BORDER = 0x2d5a1e;

    // ── 1. Grass base ─────────────────────────────────────────────────────────
    this.add.rectangle(W / 2, H / 2, W, H, GRASS).setDepth(0);

    // ── 2. Building blocks (drawn before roads so roads sit on top) ───────────

    // A1 — Train Station (cols 1-6, rows 1-4)
    block(1, 1, 6, 4, 0x5a6070);        // concrete body
    block(1, 1, 6, 2, 0x485060);        // darker roof band
    tile(2, 2, 0x88AABF, 0.2);          // windows
    tile(4, 2, 0x88AABF, 0.2);
    block(2, 3, 5, 4, 0x4a505e, 0.2);  // entry recess

    // B1 — Bollywood House (cols 9-11, rows 1-4) + Music House (cols 12-14, rows 1-4)
    block(9,  1, 11, 4, 0xD4956A);      // warm sandy
    block(9,  1, 11, 2, 0xAA6040, 0.1);
    tile(10, 2, 0xFFDD88, 0.2);
    block(12, 1, 14, 4, 0x9EB8A0);      // sage green
    block(12, 1, 14, 2, 0x7A9880, 0.1);
    tile(13, 2, 0xCCEEFF, 0.2);
    // dividing wall between the two houses
    this.add.rectangle(12 * T, 2.5 * T, 5, T * 3, 0x555555).setDepth(0.3);

    // C1 — Textile House (cols 17-19) + Fitness House (cols 20-22)
    block(17, 1, 19, 4, 0xC8A878);
    block(17, 1, 19, 2, 0xA07840, 0.1);
    tile(18, 2, 0xFFEEAA, 0.2);
    block(20, 1, 22, 4, 0x7898BC);
    block(20, 1, 22, 2, 0x5578A0, 0.1);
    tile(21, 2, 0xAADDFF, 0.2);
    this.add.rectangle(20 * T, 2.5 * T, 5, T * 3, 0x555555).setDepth(0.3);

    // A2 — Kholi / Chawl (cols 1-6, rows 7-10)
    block(1, 7, 6, 10, 0xC8A068);
    block(1, 7, 6,  8, 0xA07840, 0.1);
    tile(2, 8, 0xFFE0A0, 0.2);
    tile(4, 8, 0xFFE0A0, 0.2);
    // balcony ledge just above ground floor
    this.add.rectangle(3.5 * T, 9 * T, T * 3, 8, 0x806040).setDepth(0.3);

    // B2 — Open Park / Cricket Ground (cols 9-14, rows 7-10)
    block(9, 7, 14, 10, PARK_GRASS);
    block(11, 7, 12, 10, PARK_PITCH, 0.1); // cricket pitch strip

    // C2 — Food House (cols 17-19) + Cinema (cols 20-22)
    block(17, 7, 19, 10, 0xD86030);
    block(17, 7, 19,  8, 0xA04010, 0.1);
    tile(18, 8, 0xFFAA44, 0.2);
    block(20, 7, 22, 10, 0x303050);
    block(20, 7, 22,  8, 0x202038, 0.1);
    tile(21, 8, 0xFF4444, 0.2); // red cinema sign
    this.add.rectangle(20 * T, 8.5 * T, 5, T * 3, 0x555555).setDepth(0.3);

    // A3 — Market / Kirana + Medical (cols 1-6, rows 13-16)
    block(1, 13, 6, 16, 0xE8D4A0);
    block(1, 13, 3, 13, 0xDD6644, 0.1); // red kirana awning
    block(4, 13, 6, 13, 0x44AADD, 0.1); // blue medical awning
    tile(2, 14, 0xFFEECC, 0.2);
    tile(5, 14, 0xFFEECC, 0.2);

    // B3 — Office Building (cols 9-14, rows 13-16)
    block(9, 13, 14, 16, 0x9EB0B0);
    block(9, 13, 14, 14, 0x8AA0A0, 0.1);
    tile( 9, 14, 0xCCDDEE, 0.2);
    tile(11, 14, 0xCCDDEE, 0.2);
    tile(13, 14, 0xCCDDEE, 0.2);
    tile( 9, 15, 0xCCDDEE, 0.2);
    tile(11, 15, 0xCCDDEE, 0.2);
    tile(13, 15, 0xCCDDEE, 0.2);

    // C3 — Residential (cols 17-22, rows 13-16)
    block(17, 13, 22, 16, 0xD4C090);
    block(17, 13, 22, 14, 0xAA9070, 0.1);
    tile(19, 14, 0xFFEECC, 0.2);
    tile(21, 14, 0xFFEECC, 0.2);

    // ── 3. Roads ──────────────────────────────────────────────────────────────

    // Horizontal Road H1 (rows 5-6) — cols 1-22
    for (let c = 1; c <= 22; c++) {
      tile(c, 5, ROAD, 0.5);
      tile(c, 6, ROAD, 0.5);
    }

    // Horizontal Road H2 (rows 11-12) — cols 1-22
    for (let c = 1; c <= 22; c++) {
      tile(c, 11, ROAD, 0.5);
      tile(c, 12, ROAD, 0.5);
    }

    // Vertical Road V1 (cols 7-8) — rows 1-16
    for (let r = 1; r <= 16; r++) {
      tile(7, r, ROAD, 0.5);
      tile(8, r, ROAD, 0.5);
    }

    // Vertical Road V2 (cols 15-16) — rows 1-16
    for (let r = 1; r <= 16; r++) {
      tile(15, r, ROAD, 0.5);
      tile(16, r, ROAD, 0.5);
    }

    // ── 4. Road centre-line dashes ────────────────────────────────────────────

    const dashY_H1 = 5 * T + T; // between rows 5 and 6
    const dashY_H2 = 11 * T + T;
    const dashX_V1 = 7 * T + T;
    const dashX_V2 = 15 * T + T;

    for (let c = 1; c <= 22; c++) {
      if ((c >= 7 && c <= 8) || (c >= 15 && c <= 16)) continue; // skip intersections
      if (c % 2 === 0) {
        this.add.rectangle(c * T + T / 2, dashY_H1, T * 0.55, 5, ROAD_DASH).setDepth(0.6);
        this.add.rectangle(c * T + T / 2, dashY_H2, T * 0.55, 5, ROAD_DASH).setDepth(0.6);
      }
    }
    for (let r = 1; r <= 16; r++) {
      if ((r >= 5 && r <= 6) || (r >= 11 && r <= 12)) continue;
      if (r % 2 === 0) {
        this.add.rectangle(dashX_V1, r * T + T / 2, 5, T * 0.55, ROAD_DASH).setDepth(0.6);
        this.add.rectangle(dashX_V2, r * T + T / 2, 5, T * 0.55, ROAD_DASH).setDepth(0.6);
      }
    }

    // ── 5. Border trees ───────────────────────────────────────────────────────
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
          tile(c, r, TREE_BORDER, 1);
        }
      }
    }

    this.addPlaceholderHouseLabels();
    this.addBuildingCollision();

    // Shrink physics bounds inward by one tile so the border tree row/col is impassable.
    this.physics.world.setBounds(TILE_SIZE, TILE_SIZE, W - 2 * TILE_SIZE, H - 2 * TILE_SIZE);
    this.cameras.main.setBounds(0, 0, W, H);
  }

  // TODO: remove this method once house spritekits/tiled artwork land — these
  // text labels are temporary placeholders so houses can be told apart at a
  // glance while the visual blocks are still flat colour.
  private addPlaceholderHouseLabels(): void {
    const T = TILE_SIZE;
    const label = (cx: number, cy: number, text: string, color = '#ffffff') => {
      this.add
        .text(cx * T, cy * T, text, {
          fontSize: '28px',
          fontFamily: 'monospace',
          color,
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4,
          align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(0.4);
    };

    // Row-1 buildings — centred over the rooftop band (rows 1-2)
    label(3.5,  2.5, 'TRAIN\nSTATION');
    label(10,   2.5, 'BOLLYWOOD');
    label(13,   2.5, 'MUSIC');
    label(18,   2.5, 'TEXTILE');
    label(21,   2.5, 'FITNESS');

    // Row-2 buildings
    label(3.5,  8.5, 'KHOLI');
    label(11.5, 8.5, 'PARK',     '#ffffaa');
    label(18,   8.5, 'FOOD');
    label(21,   8.5, 'CINEMA');

    // Row-3 buildings
    label(2,    14.5, 'KIRANA');
    label(5,    14.5, 'MEDICAL');
    label(11.5, 14.5, 'OFFICE');
    label(19.5, 14.5, 'HOUSE');
  }

  // Marks every tile inside a building block as solid, with optional door exceptions.
  // Door tiles (autoTrigger) must stay walkable so the player can step on them.
  private addBuildingCollision(): void {
    const markBlock = (
      c1: number, r1: number,
      c2: number, r2: number,
      doors: [number, number][] = [],
    ) => {
      const skip = new Set(doors.map(([c, r]) => `${c},${r}`));
      for (let c = c1; c <= c2; c++) {
        for (let r = r1; r <= r2; r++) {
          if (!skip.has(`${c},${r}`)) this.solidTiles.add(`${c},${r}`);
        }
      }
    };

    // ── Row-1 blocks (rows 1-4) — doors on south face (row 4) ──────────────
    markBlock(1,  1, 6,  4);                          // A1: Train Station (no door)
    markBlock(9,  1, 14, 4, [[10, 4], [13, 4]]);      // B1: Bollywood + Music doors
    markBlock(17, 1, 22, 4, [[18, 4], [21, 4]]);      // C1: Textile + Fitness doors

    // ── Row-2 blocks (rows 7-10) — doors on south face (row 10) ────────────
    markBlock(1,  7, 6,  10, [[3, 10]]);              // A2: Kholi door
    // B2 (cols 9-14): open park — no collision
    markBlock(17, 7, 22, 10, [[18, 10], [21, 10]]);   // C2: Food + Cinema doors

    // ── Row-3 blocks (rows 13-16) — fully solid ─────────────────────────────
    // Players interact from Road H2 (row 12) facing south — no need to enter
    markBlock(1,  13, 6,  16);                        // A3: Market
    markBlock(9,  13, 14, 16);                        // B3: Office
    markBlock(17, 13, 22, 16);                        // C3: Residential
  }

  // ── Ambient animations ──────────────────────────────────────────────────────

  private addTrainAnimation(): void {
    // Train slides along the top of the map, behind the station building (A1)
    const y = 1 * TILE_SIZE + TILE_SIZE / 2;
    const train = this.add
      .rectangle(2 * TILE_SIZE + TILE_SIZE / 2, y, TILE_SIZE * 4, TILE_SIZE * 0.75, 0x4488AA)
      .setDepth(2);
    // windows
    [-1, 0, 1].forEach((offset) => {
      this.add
        .rectangle(train.x + offset * TILE_SIZE, y - 8, 22, 18, 0xAADDFF)
        .setDepth(2.1);
    });
    this.tweens.add({
      targets: train,
      x: 20 * TILE_SIZE,
      duration: 4500,
      yoyo: true,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private addBusAnimation(): void {
    // Red BEST bus rolls along Road H1 (row 6 — southbound lane)
    const y = 6 * TILE_SIZE + TILE_SIZE / 2;
    const bus = this.add
      .rectangle(2 * TILE_SIZE + TILE_SIZE / 2, y, TILE_SIZE * 1.6, TILE_SIZE * 0.8, 0xCC2200)
      .setDepth(2);
    this.add.rectangle(bus.x - 20, y - 6, 20, 18, 0xFFAAAA).setDepth(2.1); // front window
    this.add.rectangle(bus.x + 25, y - 6, 16, 18, 0xFFAAAA).setDepth(2.1); // rear window
    this.tweens.add({
      targets: bus,
      x: 22 * TILE_SIZE,
      duration: 5500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1500,
    });
  }
}
