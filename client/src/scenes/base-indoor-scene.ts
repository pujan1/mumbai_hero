import { BaseWorldScene } from './base-world-scene.js';
import { TILE_SIZE, LAYOUT } from '../config/constants.js';

export const INDOOR_MIN_TILES = 10;
export const INDOOR_MAX_TILES = 20;
export const INDOOR_DEFAULT_TILES = 12;

export abstract class BaseIndoorScene extends BaseWorldScene {
  protected getIndoorSize(): { cols: number; rows: number } {
    return { cols: INDOOR_DEFAULT_TILES, rows: INDOOR_DEFAULT_TILES };
  }

  protected buildWorld(): void {
    const raw = this.getIndoorSize();
    const cols = Math.min(INDOOR_MAX_TILES, Math.max(INDOOR_MIN_TILES, raw.cols));
    const rows = Math.min(INDOOR_MAX_TILES, Math.max(INDOOR_MIN_TILES, raw.rows));
    const totalW = cols * TILE_SIZE;
    const totalH = rows * TILE_SIZE;

    // Wall background (covers entire area before tiles are drawn)
    this.add.rectangle(totalW / 2, totalH / 2, totalW, totalH, 0x4a2f0d);

    // Floor tiles (checkerboard pattern, excluding border walls)
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const color = (r + c) % 2 === 0 ? 0xc4a35a : 0xb8943f;
        this.add.rectangle(
          c * TILE_SIZE + TILE_SIZE / 2,
          r * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE - 1, TILE_SIZE - 1, color,
        );
      }
    }

    // Window hints on top wall (every 3 tiles)
    for (let c = 2; c < cols - 2; c += 3) {
      this.add.rectangle(
        c * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2,
        TILE_SIZE - 4, TILE_SIZE - 6, 0x7ab8d4,
      );
    }

    this.physics.world.setBounds(0, 0, totalW, totalH);
    this.cameras.main.setBounds(0, 0, totalW, totalH);

    // If the room fits inside the viewport, don't let the camera pan — keep it centered
    const viewportW = this.scale.width;
    const viewportH = LAYOUT.GAME_HEIGHT;
    if (totalW <= viewportW && totalH <= viewportH) {
      this.cameras.main.stopFollow();
      this.cameras.main.centerOn(totalW / 2, totalH / 2);
    }
  }
}
