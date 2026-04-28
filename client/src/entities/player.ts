import Phaser from 'phaser';
import { TILE_SIZE, MOVE_DURATION_MS } from '../config/constants.js';
import { isDown } from '../systems/input-manager.js';

type Direction = 'up' | 'down' | 'left' | 'right';

export class Player extends Phaser.GameObjects.Sprite {
  private facing: Direction = 'down';
  private moving = false;
  private moveTimer = 0;

  facingTileOffsetX = 0;
  facingTileOffsetY = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, spriteKey: string) {
    super(scene, x, y, spriteKey);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(1);
  }

  update(delta: number, collisionCheck: (nx: number, ny: number) => boolean): void {
    if (this.moving) {
      this.moveTimer -= delta;
      if (this.moveTimer <= 0) {
        this.moving = false;
        this.moveTimer = 0;
      }
      return;
    }

    let dx = 0;
    let dy = 0;
    let dir: Direction = this.facing;

    if (isDown('up')) { dy = -1; dir = 'up'; }
    else if (isDown('down')) { dy = 1; dir = 'down'; }
    else if (isDown('left')) { dx = -1; dir = 'left'; }
    else if (isDown('right')) { dx = 1; dir = 'right'; }

    this.facing = dir;
    this.facingTileOffsetX = dx;
    this.facingTileOffsetY = dy;

    if (dx !== 0 || dy !== 0) {
      const nx = this.x + dx * TILE_SIZE;
      const ny = this.y + dy * TILE_SIZE;
      if (!collisionCheck(nx, ny)) {
        this.moving = true;
        this.moveTimer = MOVE_DURATION_MS;
        this.scene.tweens.add({
          targets: this,
          x: nx,
          y: ny,
          duration: MOVE_DURATION_MS,
          ease: 'Linear',
        });
      }
      this.play(`player-walk-${dir}`, true);
    } else {
      this.play(`player-idle-${this.facing}`, true);
    }
  }

  getFacing(): Direction {
    return this.facing;
  }
}
