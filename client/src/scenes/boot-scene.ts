import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot-scene' });
  }

  preload(): void {
    this.createPlaceholderTextures();
  }

  private createPlaceholderTextures(): void {
    const textures: { key: string; color: number }[] = [
      { key: 'player-boy',         color: 0x4488ff },
      { key: 'player-girl',        color: 0xff44aa },
      { key: 'npc-elder-bollywood',color: 0xffcc44 },
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
      { key: 'tileset-kholi',      color: 0x8b6914 },
      { key: 'tileset-neighborhood',color: 0x4a7a3d },
      { key: 'tileset-train',      color: 0x445566 },
      { key: 'tileset-house',      color: 0x996644 },
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
    const dirs = ['down', 'up', 'left', 'right'];
    ['player-boy', 'player-girl'].forEach((key) => {
      dirs.forEach((dir) => {
        this.anims.create({
          key: `${key}-walk-${dir}`,
          frames: [{ key, frame: 0 }],
          frameRate: 8,
          repeat: -1,
        });
        this.anims.create({
          key: `${key}-idle-${dir}`,
          frames: [{ key, frame: 0 }],
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
