import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot-scene' });
  }

  preload(): void {
    this.load.spritesheet('player-boy', 'assets/sprites/characters/player-boy.png', {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet('player-girl', 'assets/sprites/characters/player-girl.png', {
      frameWidth: 100,
      frameHeight: 100,
    });

    // Elder NPCs: 4 cols × 1 row, each frame 100×100 (facing: down, up, left, right)
    this.load.spritesheet('npc-elder-bollywood', 'assets/sprites/npcs/npc-elder-bollywood.png', {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.image('tileset-kholi-a', 'assets/tilesets/tileset-kholi-a.png');
    this.load.image('tileset-kholi-b', 'assets/tilesets/tileset-kholi-b.png');
    this.load.tilemapTiledJSON('map-kholi', 'assets/maps/kholi-interior.tmj');

    this.createPlaceholderTextures();
  }

  private createPlaceholderTextures(): void {
    const textures: { key: string; color: number }[] = [
      // npc-elder-bollywood is a real spritesheet — loaded above
      { key: 'npc-elder-music',    color: 0xaa44ff },
      { key: 'npc-elder-textile',  color: 0x44ffaa },
      { key: 'npc-elder-fitness',  color: 0xff4444 },
      { key: 'npc-elder-food',     color: 0xff8844 },
      { key: 'npc-elder-cinema',   color: 0x44aaff },
      { key: 'npc-chai-wallah',    color: 0xcc8844 },
      { key: 'npc-cricket-kid',    color: 0x44cc44 },
      { key: 'npc-laundry-aunty',  color: 0x44cccc },
      { key: 'npc-vendor',         color: 0x888844 },
      { key: 'npc-dog',            color: 0xcc9966 },
{ key: 'tileset-neighborhood-a',       color: 0x4a7a3d },
      { key: 'tileset-neighborhood-b',       color: 0x3d6630 },
      { key: 'tileset-train',                color: 0x445566 },
      { key: 'tileset-house-arch',           color: 0x996644 },
      { key: 'tileset-house-shared',         color: 0x885533 },
      { key: 'tileset-house-music-textile',  color: 0x774422 },
      { key: 'tileset-house-fitness-food',   color: 0x993333 },
      { key: 'tileset-house-cinema',         color: 0x334466 },
    ];

    textures.forEach(({ key, color }) => {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(color);
      g.fillRect(0, 0, 100, 100);
      g.generateTexture(key, 100, 100);
      g.destroy();
    });
  }

  private createAnimations(): void {
    const dirs = ['down', 'up', 'left', 'right'] as const;

    // Elder NPC idle animations — 4-frame sheet: col 0=down, 1=up, 2=left, 3=right
    dirs.forEach((dir, frame) => {
      this.anims.create({
        key: `npc-elder-bollywood-idle-${dir}`,
        frames: [{ key: 'npc-elder-bollywood', frame }],
        frameRate: 1,
        repeat: -1,
      });
    });

    // Real spritesheet: 5 cols × 4 rows, 100×100 each
    // Row order: down, up, left, right — col 0 = idle, cols 1–4 = walk
    dirs.forEach((dir, row) => {
      const base = row * 5;
      this.anims.create({
        key: `player-boy-idle-${dir}`,
        frames: [{ key: 'player-boy', frame: base }],
        frameRate: 1,
        repeat: -1,
      });
      this.anims.create({
        key: `player-boy-walk-${dir}`,
        frames: this.anims.generateFrameNumbers('player-boy', {
          frames: [base + 1, base + 2, base + 3, base + 4],
        }),
        frameRate: 8,
        repeat: -1,
      });
    });

    // Real spritesheet: same 5 cols × 4 rows layout as player-boy
    dirs.forEach((dir, row) => {
      const base = row * 5;
      this.anims.create({
        key: `player-girl-idle-${dir}`,
        frames: [{ key: 'player-girl', frame: base }],
        frameRate: 1,
        repeat: -1,
      });
      this.anims.create({
        key: `player-girl-walk-${dir}`,
        frames: this.anims.generateFrameNumbers('player-girl', {
          frames: [base + 1, base + 2, base + 3, base + 4],
        }),
        frameRate: 8,
        repeat: -1,
      });
    });
  }

  async create(): Promise<void> {
    this.createAnimations();
    this.scene.start('title-scene');
  }
}
