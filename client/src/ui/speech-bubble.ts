import { GameObjects, Geom, Scene } from 'phaser';
import { advanceDialogue } from '../systems/dialogue-system.js';

const NPC_FILL = 0xfffbeb;
const NPC_STROKE = 0x1a120b;
const NPC_TEXT = '#1a120b';
const PLAYER_FILL = 0xdbeeff;
const PLAYER_STROKE = 0x0e3a5c;
const PLAYER_TEXT = '#0e3a5c';

const PAD_X = 22;
const PAD_Y = 16;
const TAIL_HEIGHT = 18;
const TAIL_HALF_WIDTH = 14;
const CORNER_RADIUS = 18;
const MAX_WIDTH = 700;

export class SpeechBubble extends GameObjects.Container {
  private bg: GameObjects.Graphics;
  private text: GameObjects.Text;
  private target: GameObjects.GameObject & { x: number; y: number; displayHeight: number } | null = null;
  private targetOffsetY = 6;

  constructor(scene: Scene) {
    super(scene, 0, 0);
    this.bg = scene.add.graphics();
    this.text = scene.add.text(0, 0, '', {
      fontSize: '30px',
      fontFamily: 'monospace',
      color: NPC_TEXT,
      align: 'center',
      wordWrap: { width: MAX_WIDTH },
    }).setOrigin(0.5, 1);
    this.add([this.bg, this.text]);
    scene.add.existing(this);
    this.setDepth(20);
    this.setVisible(false);

    this.bg.setInteractive(
      new Geom.Rectangle(-MAX_WIDTH / 2, -400, MAX_WIDTH, 400),
      Geom.Rectangle.Contains,
    );
    this.bg.on('pointerdown', () => advanceDialogue());
  }

  show(
    target: GameObjects.GameObject & { x: number; y: number; displayHeight: number },
    text: string,
    isPlayer: boolean,
  ): void {
    this.target = target;
    this.text.setColor(isPlayer ? PLAYER_TEXT : NPC_TEXT);
    this.text.setText(text);
    this.redraw(isPlayer);
    this.setVisible(true);
    this.updatePosition();

    this.scene.tweens.killTweensOf(this);
    this.setAlpha(0);
    this.setScale(0.7);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.out',
    });
  }

  hide(): void {
    if (!this.visible) return;
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 100,
      ease: 'Quad.in',
      onComplete: () => {
        this.setVisible(false);
        this.target = null;
      },
    });
  }

  hideImmediate(): void {
    this.scene.tweens.killTweensOf(this);
    this.setVisible(false);
    this.target = null;
  }

  refreshPosition(): void {
    if (!this.visible || !this.target) return;
    this.updatePosition();
  }

  private updatePosition(): void {
    if (!this.target) return;
    // Sprite origin is (0.5, 1) → target.y is the foot. Anchor sits a little above the head.
    this.x = this.target.x;
    this.y = this.target.y - this.target.displayHeight - this.targetOffsetY;
  }

  private redraw(isPlayer: boolean): void {
    const tw = Math.min(this.text.width, MAX_WIDTH);
    const th = this.text.height;
    const w = tw + PAD_X * 2;
    const h = th + PAD_Y * 2;

    // Bubble bottom sits at y = -TAIL_HEIGHT (tail occupies 0 → -TAIL_HEIGHT).
    // Text bottom-center at (0, -TAIL_HEIGHT - PAD_Y) so PAD_Y of breathing room above tail.
    this.text.setPosition(0, -TAIL_HEIGHT - PAD_Y);

    const top = -TAIL_HEIGHT - h;
    const left = -w / 2;

    this.bg.clear();
    this.bg.fillStyle(isPlayer ? PLAYER_FILL : NPC_FILL, 1);
    this.bg.lineStyle(4, isPlayer ? PLAYER_STROKE : NPC_STROKE);
    this.bg.fillRoundedRect(left, top, w, h, CORNER_RADIUS);
    this.bg.strokeRoundedRect(left, top, w, h, CORNER_RADIUS);

    // Tail filled (covers bottom border seam at the base) then outline.
    this.bg.fillTriangle(-TAIL_HALF_WIDTH, -TAIL_HEIGHT, TAIL_HALF_WIDTH, -TAIL_HEIGHT, 0, 0);
    this.bg.lineStyle(4, isPlayer ? PLAYER_STROKE : NPC_STROKE);
    this.bg.lineBetween(-TAIL_HALF_WIDTH, -TAIL_HEIGHT, 0, 0);
    this.bg.lineBetween(TAIL_HALF_WIDTH, -TAIL_HEIGHT, 0, 0);
    // Re-draw a short fill segment over the bubble's bottom border between the tail base.
    this.bg.fillStyle(isPlayer ? PLAYER_FILL : NPC_FILL, 1);
    this.bg.fillRect(-TAIL_HALF_WIDTH + 1, -TAIL_HEIGHT - 2, TAIL_HALF_WIDTH * 2 - 2, 4);

    this.bg.setInteractive(
      new Geom.Rectangle(left, top, w, h + TAIL_HEIGHT),
      Geom.Rectangle.Contains,
    );
  }
}
