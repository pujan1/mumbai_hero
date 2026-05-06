import { GameObjects, Scene, type Time, type Tweens } from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../config/constants.js';
import { setTouchState } from '../systems/input-manager.js';
import type { InputAction } from '../systems/input-manager.js';
import { eventBus } from '../utils/event-bus.js';
import type { ContextHint, ContextHintKind } from '../scenes/base-world-scene.js';

// All sizes are in logical pixels (1200×2600 canvas).
// At ~0.33 display scale the D-pad arms render ≈43 px CSS — just above Apple's
// 44 px touch-target minimum.

const ARM_SIZE  = 130;
const ARM_GAP   = 155;
const HUB_SIZE  = 48;
const BTN_R     = 74;
const FONT      = '58px';
const A_LABEL_FONT = '34px';

const IDLE_ALPHA = 0.42;
const ACTIVE_ALPHA = 0.85;
const IDLE_FADE_DELAY = 2000;

export class OnScreenControls extends GameObjects.Container {
  private fadeTween: Tweens.Tween | null = null;
  private idleTimer: Time.TimerEvent | null = null;
  private aLabel!: GameObjects.Text;
  private currentContext: ContextHintKind = null;

  constructor(scene: Scene) {
    super(scene, 0, 0);

    const padX = 250;
    const padY = LOGICAL_HEIGHT - 420;

    const aX = LOGICAL_WIDTH - 230;
    const aY = LOGICAL_HEIGHT - 560;
    const bX = LOGICAL_WIDTH - 90;
    const bY = LOGICAL_HEIGHT - 340;

    this.makeDPad(scene, padX, padY);
    this.makeActionButton(scene, aX, aY);
    this.makeButton(scene, bX, bY, 'B', 'cancel', 0x3355cc);

    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(9);
    this.setAlpha(IDLE_ALPHA);

    eventBus.on('context:hint', (hint) => this.applyContext(hint));
  }

  private makeActionButton(scene: Scene, x: number, y: number): void {
    const circle = scene.add.circle(x, y, BTN_R, 0xcc3333, 0.85);
    const text = scene.add.text(x, y, 'A', {
      fontSize: FONT,
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.aLabel = text;

    circle.setInteractive();
    circle.on('pointerdown', () => { this.wake(); setTouchState('action', true); });
    circle.on('pointerup',   () => setTouchState('action', false));
    circle.on('pointerout',  () => setTouchState('action', false));

    this.add([circle, text]);
  }

  private makeButton(
    scene: Scene,
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
    circle.on('pointerdown', () => { this.wake(); setTouchState(action, true); });
    circle.on('pointerup',   () => setTouchState(action, false));
    circle.on('pointerout',  () => setTouchState(action, false));

    this.add([circle, text]);
  }

  private makeDPad(scene: Scene, cx: number, cy: number): void {
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

      rect.on('pointerdown', () => { this.wake(); setTouchState(action, true); });
      rect.on('pointerup',   () => setTouchState(action, false));
      rect.on('pointerout',  () => setTouchState(action, false));

      this.add([rect, arrow]);
    });

    this.add(scene.add.rectangle(cx, cy, HUB_SIZE, HUB_SIZE, 0x2a3344, 0.8));
  }

  private applyContext(hint: ContextHint): void {
    if (hint.kind === this.currentContext) return;
    this.currentContext = hint.kind;
    const label = labelForContext(hint.kind);
    this.aLabel.setStyle({
      fontSize: hint.kind ? A_LABEL_FONT : FONT,
      fontFamily: 'monospace',
      color: '#ffffff',
    });
    this.aLabel.setText(label);
    if (hint.kind) this.wake();
    this.scene.tweens.killTweensOf(this.aLabel);
    this.aLabel.setScale(hint.kind ? 0.7 : 0.9);
    this.scene.tweens.add({
      targets: this.aLabel,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.out',
    });
  }

  private wake(): void {
    this.fadeTween?.stop();
    this.fadeTween = null;
    this.setAlpha(ACTIVE_ALPHA);
    this.idleTimer?.remove();
    this.idleTimer = this.scene.time.delayedCall(IDLE_FADE_DELAY, () => {
      this.fadeTween = this.scene.tweens.add({
        targets: this,
        alpha: IDLE_ALPHA,
        duration: 500,
        ease: 'Quad.out',
      });
    });
  }
}

function labelForContext(kind: ContextHintKind): string {
  switch (kind) {
    case 'talk':  return 'TALK';
    case 'shop':  return 'SHOP';
    case 'open':  return 'OPEN';
    case 'enter': return 'ENTER';
    default:      return 'A';
  }
}
