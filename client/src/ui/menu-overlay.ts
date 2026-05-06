import { GameObjects, Scene } from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../config/constants.js';

export class MenuOverlay extends GameObjects.Container {
  private bg: GameObjects.Rectangle;
  private visible_ = false;

  constructor(scene: Scene) {
    super(scene, 0, 0);

    this.bg = scene.add.rectangle(
      LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2,
      LOGICAL_WIDTH, LOGICAL_HEIGHT,
      0x000000, 0.75,
    );

    const title = scene.add.text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 40, 'PAUSED', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    this.add([this.bg, title]);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(20);
    this.setVisible(false);
  }

  toggle(): void {
    this.visible_ = !this.visible_;
    this.setVisible(this.visible_);
  }

  isMenuOpen(): boolean {
    return this.visible_;
  }
}
