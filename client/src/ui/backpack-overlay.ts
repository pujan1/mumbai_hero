import Phaser from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../config/constants.js';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';
import { ITEMS } from '../data/items.js';
import { DEFAULT_BACKPACK_CAPACITY } from '@mumbai-hero/shared';
import { setActiveOverlay } from '../systems/ui-state.js';

const COLS = 5;
const SLOT_SIZE = 140;
const SLOT_GAP = 18;

export class BackpackOverlay extends Phaser.GameObjects.Container {
  private isOpen_ = false;
  private bg: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Rectangle;
  private titleTxt: Phaser.GameObjects.Text;
  private hintTxt: Phaser.GameObjects.Text;
  private slotChildren: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.bg = scene.add.rectangle(
      LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2,
      LOGICAL_WIDTH, LOGICAL_HEIGHT,
      0x000000, 0.78,
    );

    this.panel = scene.add.rectangle(
      LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2,
      LOGICAL_WIDTH * 0.85, LOGICAL_HEIGHT * 0.7,
      0x1a1a2e, 0.98,
    );
    this.panel.setStrokeStyle(4, 0x5a6acf);

    this.titleTxt = scene.add.text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.18, 'BACKPACK', {
      fontSize: '64px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.hintTxt = scene.add.text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.82, '[ I ] close   [ X ] close', {
      fontSize: '28px', fontFamily: 'monospace', color: '#aaaacc',
    }).setOrigin(0.5);

    this.add([this.bg, this.panel, this.titleTxt, this.hintTxt]);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(30);
    this.setVisible(false);

    eventBus.on('inventory:changed', () => {
      if (this.isOpen_) this.renderSlots();
    });
  }

  isBackpackOpen(): boolean {
    return this.isOpen_;
  }

  toggle(): void {
    this.isOpen_ ? this.close() : this.open();
  }

  open(): void {
    this.isOpen_ = true;
    this.setVisible(true);
    setActiveOverlay('backpack');
    this.renderSlots();
  }

  close(): void {
    this.isOpen_ = false;
    this.setVisible(false);
    setActiveOverlay(null);
  }

  private clearSlots(): void {
    for (const child of this.slotChildren) child.destroy();
    this.slotChildren = [];
  }

  private renderSlots(): void {
    this.clearSlots();
    const p = clientGameState.progression;
    const inventory = p?.inventory ?? [];
    const capacity = p?.backpackCapacity ?? DEFAULT_BACKPACK_CAPACITY;

    this.titleTxt.setText(`BACKPACK   ${inventory.length} / ${capacity}`);

    const rows = Math.ceil(capacity / COLS);
    const gridW = COLS * SLOT_SIZE + (COLS - 1) * SLOT_GAP;
    const gridH = rows * SLOT_SIZE + (rows - 1) * SLOT_GAP;
    const startX = (LOGICAL_WIDTH - gridW) / 2 + SLOT_SIZE / 2;
    const startY = LOGICAL_HEIGHT * 0.5 - gridH / 2 + SLOT_SIZE / 2 + 40;

    for (let i = 0; i < capacity; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = startX + col * (SLOT_SIZE + SLOT_GAP);
      const cy = startY + row * (SLOT_SIZE + SLOT_GAP);

      const slotBg = this.scene.add
        .rectangle(cx, cy, SLOT_SIZE, SLOT_SIZE, 0x2a2a44, 1)
        .setStrokeStyle(2, 0x4a4a6a)
        .setScrollFactor(0)
        .setDepth(31);
      this.add(slotBg);
      this.slotChildren.push(slotBg);

      const slot = inventory[i];
      if (!slot) continue;
      const def = ITEMS[slot.itemId];
      if (!def) continue;

      const icon = this.scene.add
        .rectangle(cx, cy - 14, SLOT_SIZE - 36, SLOT_SIZE - 60, def.iconColor)
        .setScrollFactor(0)
        .setDepth(32);
      const name = this.scene.add
        .text(cx, cy + SLOT_SIZE / 2 - 28, def.name, {
          fontSize: '18px', fontFamily: 'monospace', color: '#ffffff', align: 'center',
          wordWrap: { width: SLOT_SIZE - 8 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(32);
      const qty = this.scene.add
        .text(cx + SLOT_SIZE / 2 - 8, cy + SLOT_SIZE / 2 - 8, `x${slot.quantity}`, {
          fontSize: '24px', fontFamily: 'monospace', color: '#ffd866', fontStyle: 'bold',
        })
        .setOrigin(1, 1)
        .setScrollFactor(0)
        .setDepth(32);

      this.add([icon, name, qty]);
      this.slotChildren.push(icon, name, qty);
    }
  }
}
