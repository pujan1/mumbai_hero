import { BaseWorldScene } from './base-world-scene.js';
import { TILE_SIZE } from '../config/constants.js';

export abstract class BaseOutdoorScene extends BaseWorldScene {
  protected getMapSize(): { cols: number; rows: number } {
    return { cols: 24, rows: 18 };
  }

  protected buildWorld(): void {
    const { cols, rows } = this.getMapSize();
    const totalW = cols * TILE_SIZE;
    const totalH = rows * TILE_SIZE;

    // Grass base
    this.add.rectangle(totalW / 2, totalH / 2, totalW, totalH, 0x4a7a3d);

    // Dirt path running horizontally through the middle third
    const pathRow1 = Math.floor(rows * 0.35);
    const pathRow2 = Math.floor(rows * 0.65);
    for (let r = pathRow1; r <= pathRow2; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const isDirtPath = r === pathRow1 || r === pathRow2;
        this.add.rectangle(
          c * TILE_SIZE + TILE_SIZE / 2,
          r * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE, TILE_SIZE,
          isDirtPath ? 0x8a7050 : 0x9a8060,
        );
      }
    }

    // Tree/wall border
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          this.add.rectangle(
            c * TILE_SIZE + TILE_SIZE / 2,
            r * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE, TILE_SIZE, 0x2d5a1e,
          );
        }
      }
    }

    this.physics.world.setBounds(0, 0, totalW, totalH);
    this.cameras.main.setBounds(0, 0, totalW, totalH);
  }
}
