import { BaseWorldScene } from './base-world-scene.js';
import { TILE_SIZE, LAYOUT } from '../config/constants.js';

export const INDOOR_MIN_TILES = 10;
export const INDOOR_MAX_TILES = 20;
export const INDOOR_DEFAULT_TILES = 12;

export interface RoomSection {
  col: number;
  row: number;
  cols: number;
  rows: number;
}

export interface RoomLayout {
  totalCols: number;
  totalRows: number;
  sections: RoomSection[];
}

export abstract class BaseIndoorScene extends BaseWorldScene {
  protected getRoomLayout(): RoomLayout {
    return {
      totalCols: INDOOR_DEFAULT_TILES,
      totalRows: INDOOR_DEFAULT_TILES,
      sections: [{ col: 0, row: 0, cols: INDOOR_DEFAULT_TILES, rows: INDOOR_DEFAULT_TILES }],
    };
  }

  create(data: { spawnPoint?: string }): void {
    super.create(data);
    // Camera centering must happen after super.create() calls startFollow()
    const layout = this.getRoomLayout();
    const totalW = layout.totalCols * TILE_SIZE;
    const totalH = layout.totalRows * TILE_SIZE;
    if (totalW <= this.scale.width && totalH <= LAYOUT.GAME_HEIGHT) {
      this.cameras.main.stopFollow();
      this.cameras.main.centerOn(totalW / 2, totalH / 2);
    }
  }

  protected buildWorld(): void {
    const cfg = this.getSceneConfig();
    const layout = this.getRoomLayout();
    const totalW = layout.totalCols * TILE_SIZE;
    const totalH = layout.totalRows * TILE_SIZE;

    if (this.cache.tilemap.has(cfg.mapKey)) {
      const map = this.make.tilemap({ key: cfg.mapKey });
      const tilesets = cfg.tilesetNames.map((name, i) =>
        map.addTilesetImage(name, cfg.tilesetKeys[i])!,
      );

      for (const layerData of map.layers) {
        const layer = map.createLayer(layerData.name, tilesets, 0, 0);
        if (!layer) continue;
        if (layerData.name === 'collision') {
          layer.setCollisionByExclusion([-1, 0]);
          this.collisionLayer = layer;
        }
      }

      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      return;
    }

    // Procedural fallback while tilemap is not yet authored
    for (const section of layout.sections) {
      const sx = section.col * TILE_SIZE;
      const sy = section.row * TILE_SIZE;
      const sw = section.cols * TILE_SIZE;
      const sh = section.rows * TILE_SIZE;

      this.add.rectangle(sx + sw / 2, sy + sh / 2, sw, sh, 0x4a2f0d);

      for (let r = section.row + 1; r < section.row + section.rows - 1; r++) {
        for (let c = section.col + 1; c < section.col + section.cols - 1; c++) {
          const color = (r + c) % 2 === 0 ? 0xc4a35a : 0xb8943f;
          this.add.rectangle(
            c * TILE_SIZE + TILE_SIZE / 2,
            r * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE - 1, TILE_SIZE - 1, color,
          );
        }
      }

      if (section.row === 0) {
        for (let c = section.col + 2; c < section.col + section.cols - 2; c += 3) {
          this.add.rectangle(
            c * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE / 2,
            TILE_SIZE - 4, TILE_SIZE - 6, 0x7ab8d4,
          );
        }
      }
    }

    this.physics.world.setBounds(0, 0, totalW, totalH);
    this.cameras.main.setBounds(0, 0, totalW, totalH);
  }
}
