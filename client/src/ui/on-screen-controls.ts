import Phaser from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../config/constants.js';
import { setTouchState } from '../systems/input-manager.js';
import type { InputAction } from '../systems/input-manager.js';

// All sizes are in logical pixels (1200×2600 canvas).
// At ~0.33 display scale the D-pad arms render ≈43 px CSS — just above Apple's
// 44 px touch-target minimum.

const ARM_SIZE  = 130;   // D-pad arm button width/height
const ARM_GAP   = 155;   // center-to-center distance between arm and hub
const HUB_SIZE  = 48;    // small center square (non-interactive)
const BTN_R     = 74;    // action-button circle radius
const FONT      = '58px';

export class OnScreenControls extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    // D-pad — bottom-left quadrant
    const padX = 250;
    const padY = LOGICAL_HEIGHT - 420;

    // Action buttons — bottom-right quadrant
    const aX = LOGICAL_WIDTH - 230;
    const aY = LOGICAL_HEIGHT - 560;
    const bX = LOGICAL_WIDTH - 90;
    const bY = LOGICAL_HEIGHT - 340;

    this.makeDPad(scene, padX, padY);
    this.makeButton(scene, aX, aY, 'A', 'action', 0xcc3333);
    this.makeButton(scene, bX, bY, 'B', 'cancel', 0x3355cc);

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(9);
    this.setAlpha(0.60);
  }

  private makeButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    action: InputAction,
    color: number,
  ): void {
    const circle = scene.add.circle(x, y, BTN_R, color, 0.85);
    const text = scene.add.text(x, y, label, {
      fontSize: FONT,
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5);

    circle.setInteractive();
    circle.on('pointerdown', () => setTouchState(action, true));
    circle.on('pointerup',   () => setTouchState(action, false));
    circle.on('pointerout',  () => setTouchState(action, false));

    this.add([circle, text]);
  }

  private makeDPad(scene: Phaser.Scene, cx: number, cy: number): void {
    const dirs: { dx: number; dy: number; action: InputAction; label: string }[] = [
      { dx:  0, dy: -1, action: 'up',    label: '▲' },
      { dx:  0, dy:  1, action: 'down',  label: '▼' },
      { dx: -1, dy:  0, action: 'left',  label: '◀' },
      { dx:  1, dy:  0, action: 'right', label: '▶' },
    ];

    dirs.forEach(({ dx, dy, action, label }) => {
      const bx = cx + dx * ARM_GAP;
      const by = cy + dy * ARM_GAP;
      const rect = scene.add
        .rectangle(bx, by, ARM_SIZE, ARM_SIZE, 0x445566, 0.85)
        .setInteractive();
      const arrow = scene.add
        .text(bx, by, label, { fontSize: FONT, fontFamily: 'monospace', color: '#ccddff' })
        .setOrigin(0.5);

      rect.on('pointerdown', () => setTouchState(action, true));
      rect.on('pointerup',   () => setTouchState(action, false));
      rect.on('pointerout',  () => setTouchState(action, false));

      this.add([rect, arrow]);
    });

    // Non-interactive hub
    this.add(scene.add.rectangle(cx, cy, HUB_SIZE, HUB_SIZE, 0x2a3344, 0.8));
  }
}
