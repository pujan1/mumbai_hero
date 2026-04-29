import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot-scene' });
  }

  preload(): void {
    // Each sheet is 557×448 px: 5 cols × 4 rows, frame = 111×112 px
    this.load.spritesheet('player-boy', 'assets/sprites/characters/player-boy.png', {
      frameWidth: 111,
      frameHeight: 112,
    });
    this.load.spritesheet('player-girl', 'assets/sprites/characters/player-girl.png', {
      frameWidth: 111,
      frameHeight: 112,
    });
    this.createPlaceholderTextures();
  }

  private createPlaceholderTextures(): void {
    const sprites: { key: string; color: number }[] = [
      { key: 'npc-elder-bollywood', color: 0xffaa00 },
      { key: 'npc-elder-music', color: 0xaa44ff },
      { key: 'npc-elder-textile', color: 0x44ffaa },
      { key: 'npc-elder-fitness', color: 0xff4444 },
      { key: 'npc-elder-food', color: 0xff8844 },
      { key: 'npc-elder-cinema', color: 0x44aaff },
      { key: 'npc-chai-wallah', color: 0xcc8844 },
      { key: 'npc-cricket-kid', color: 0x44cc44 },
      { key: 'npc-laundry-aunty', color: 0x44cccc },
      { key: 'npc-vendor', color: 0x888844 },
      { key: 'npc-dog', color: 0xcc9966 },
    ];

    const tilesets: { key: string; color: number }[] = [
      { key: 'tileset-kholi', color: 0x886644 },
      { key: 'tileset-neighborhood', color: 0x667744 },
      { key: 'tileset-train', color: 0x445566 },
      { key: 'tileset-house', color: 0x996644 },
    ];

    [...sprites, ...tilesets].forEach(({ key, color }) => {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(color);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture(key, 32, 32);
      g.destroy();
    });
  }

  private createAnimations(): void {
    // Sheet layout: 5 cols × 4 rows, 32×32 per frame
    // Row 0 = down, Row 1 = up, Row 2 = left, Row 3 = right
    // Col 0 = idle, Cols 1-4 = walk frames
    const dirs: { dir: string; idle: number; walkStart: number; walkEnd: number }[] = [
      { dir: 'down',  idle: 0,  walkStart: 1,  walkEnd: 4  },
      { dir: 'up',    idle: 5,  walkStart: 6,  walkEnd: 9  },
      { dir: 'left',  idle: 10, walkStart: 11, walkEnd: 14 },
      { dir: 'right', idle: 15, walkStart: 16, walkEnd: 19 },
    ];

    ['player-boy', 'player-girl'].forEach((key) => {
      dirs.forEach(({ dir, idle, walkStart, walkEnd }) => {
        this.anims.create({
          key: `${key}-walk-${dir}`,
          frames: this.anims.generateFrameNumbers(key, { start: walkStart, end: walkEnd }),
          frameRate: 8,
          repeat: -1,
        });
        this.anims.create({
          key: `${key}-idle-${dir}`,
          frames: [{ key, frame: idle }],
          frameRate: 1,
          repeat: -1,
        });
      });
    });
  }

  async create(): Promise<void> {
    this.createAnimations();
    this.scene.start('title-scene');
  }
}
