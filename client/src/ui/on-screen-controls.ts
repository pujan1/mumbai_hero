import Phaser from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT, LAYOUT } from '../config/constants.js';
import { setTouchState } from '../systems/input-manager.js';
import type { InputAction } from '../systems/input-manager.js';

export class OnScreenControls extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    const gameTop = LAYOUT.HUD_HEIGHT + LAYOUT.DIALOGUE_HEIGHT;
    const padX = 56;
    const padY = LOGICAL_HEIGHT - 80;
    const btnX = LOGICAL_WIDTH - 60;
    const btnY = LOGICAL_HEIGHT - 80;

    this.makeDPad(scene, padX, padY);
    this.makeButton(scene, btnX, btnY - 20, 'A', 'action', 0xcc3333);
    this.makeButton(scene, btnX + 28, btnY + 8, 'B', 'cancel', 0x3355cc);

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(9);
    this.setAlpha(0.55);

    void gameTop;
  }

  private makeButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    action: InputAction,
    color: number,
  ): void {
    const circle = scene.add.circle(x, y, 16, color, 0.8);
    const text = scene.add.text(x, y, label, {
      fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    circle.setInteractive();
    circle.on('pointerdown', () => setTouchState(action, true));
    circle.on('pointerup', () => setTouchState(action, false));
    circle.on('pointerout', () => setTouchState(action, false));

    this.add([circle, text]);
  }

  private makeDPad(scene: Phaser.Scene, cx: number, cy: number): void {
    const dirs: { dx: number; dy: number; action: InputAction }[] = [
      { dx: 0, dy: -1, action: 'up' },
      { dx: 0, dy: 1, action: 'down' },
      { dx: -1, dy: 0, action: 'left' },
      { dx: 1, dy: 0, action: 'right' },
    ];

    dirs.forEach(({ dx, dy, action }) => {
      const bx = cx + dx * 28;
      const by = cy + dy * 28;
      const rect = scene.add.rectangle(bx, by, 24, 24, 0x555577, 0.8).setInteractive();
      rect.on('pointerdown', () => setTouchState(action, true));
      rect.on('pointerup', () => setTouchState(action, false));
      rect.on('pointerout', () => setTouchState(action, false));
      this.add(rect);
    });

    const center = scene.add.rectangle(cx, cy, 24, 24, 0x333355, 0.8);
    this.add(center);
  }
}
