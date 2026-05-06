import { GameObjects, Scene } from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../config/constants.js';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';
import { ITEMS } from '../data/items.js';
import {
  buyFromMerchant,
  sellToMerchant,
  countOf,
  type InventoryHolder,
} from '../systems/inventory-system.js';
import type { ShopConfig } from '../entities/npc.js';
import { setActiveOverlay } from '../systems/ui-state.js';

type Tab = 'buy' | 'sell';

export interface ShopRequest {
  shop: ShopConfig;
  merchant: InventoryHolder;
}

const ROW_HEIGHT = 64;
const PANEL_PADDING = 40;

// Trade window. Talks to InventorySystem for the actual transactions; this
// class only renders the list and forwards keypresses.
export class ShopOverlay extends GameObjects.Container {
  private isOpen_ = false;
  private bg: GameObjects.Rectangle;
  private panel: GameObjects.Rectangle;
  private titleTxt: GameObjects.Text;
  private moneyTxt: GameObjects.Text;
  private tabsTxt: GameObjects.Text;
  private hintTxt: GameObjects.Text;
  private statusTxt: GameObjects.Text;
  private rowChildren: GameObjects.GameObject[] = [];

  private tab: Tab = 'buy';
  private cursor = 0;
  private current: ShopRequest | null = null;

  constructor(scene: Scene) {
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
    ).setStrokeStyle(4, 0xf5c842);

    this.titleTxt = scene.add.text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.18, 'SHOP', {
      fontSize: '52px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.moneyTxt = scene.add.text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.22, '₹0', {
      fontSize: '36px', fontFamily: 'monospace', color: '#f5c842',
    }).setOrigin(0.5);

    this.tabsTxt = scene.add.text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.26, '', {
      fontSize: '32px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    this.statusTxt = scene.add.text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.78, '', {
      fontSize: '26px', fontFamily: 'monospace', color: '#aaffaa', align: 'center',
    }).setOrigin(0.5);

    this.hintTxt = scene.add.text(
      LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.82,
      '[ ↑↓ ] select   [ ←→ ] tab   [ Z ] confirm   [ X ] close',
      { fontSize: '24px', fontFamily: 'monospace', color: '#aaaacc' },
    ).setOrigin(0.5);

    this.add([this.bg, this.panel, this.titleTxt, this.moneyTxt, this.tabsTxt, this.statusTxt, this.hintTxt]);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(30);
    this.setVisible(false);

    eventBus.on('inventory:changed', () => {
      if (this.isOpen_) this.render();
    });
    eventBus.on('hud:refresh', () => {
      if (this.isOpen_) this.render();
    });
  }

  isShopOpen(): boolean {
    return this.isOpen_;
  }

  open(req: ShopRequest): void {
    this.current = req;
    this.tab = 'buy';
    this.cursor = 0;
    this.statusTxt.setText('');
    this.isOpen_ = true;
    this.setVisible(true);
    setActiveOverlay('shop');
    this.render();
  }

  close(): void {
    this.isOpen_ = false;
    this.current = null;
    this.setVisible(false);
    setActiveOverlay(null);
  }

  // Called by HUDScene when a key is pressed while the shop is open. Returns
  // true if the input was consumed, so the world scene knows to ignore it.
  handleInput(key: 'up' | 'down' | 'left' | 'right' | 'action' | 'cancel'): boolean {
    if (!this.isOpen_ || !this.current) return false;
    const list = this.activeList();

    switch (key) {
      case 'up':
        if (list.length > 0) {
          this.cursor = (this.cursor - 1 + list.length) % list.length;
          this.render();
        }
        return true;
      case 'down':
        if (list.length > 0) {
          this.cursor = (this.cursor + 1) % list.length;
          this.render();
        }
        return true;
      case 'left':
      case 'right':
        this.tab = this.tab === 'buy' ? 'sell' : 'buy';
        this.cursor = 0;
        this.statusTxt.setText('');
        this.render();
        return true;
      case 'action':
        this.confirmTrade();
        return true;
      case 'cancel':
        this.close();
        return true;
    }
    return false;
  }

  // List of {itemId, qty, price} rows for the active tab.
  private activeList(): { itemId: string; qty: number; price: number }[] {
    if (!this.current) return [];
    const { shop, merchant } = this.current;
    const inv = clientGameState.progression?.inventory ?? [];

    if (this.tab === 'buy') {
      return shop.sells.map((id) => {
        const def = ITEMS[id]!;
        return {
          itemId: id,
          qty: countOf(merchant.inventory, id),
          price: def.buyPrice,
        };
      });
    }
    return shop.buys.map((id) => {
      const def = ITEMS[id]!;
      return {
        itemId: id,
        qty: countOf(inv, id),
        price: def.sellPrice,
      };
    });
  }

  private confirmTrade(): void {
    if (!this.current) return;
    const list = this.activeList();
    const row = list[this.cursor];
    if (!row) return;

    if (this.tab === 'buy') {
      const result = buyFromMerchant(this.current.merchant, row.itemId, 1);
      if (result.ok) {
        this.statusTxt.setColor('#aaffaa');
        this.statusTxt.setText(`Bought 1 ${ITEMS[row.itemId]!.name} for ₹${row.price}`);
      } else {
        this.statusTxt.setColor('#ff8888');
        this.statusTxt.setText(this.reasonText(result.reason));
      }
    } else {
      const result = sellToMerchant(this.current.merchant, row.itemId, 1);
      if (result.ok) {
        this.statusTxt.setColor('#aaffaa');
        this.statusTxt.setText(`Sold 1 ${ITEMS[row.itemId]!.name} for ₹${row.price}`);
      } else {
        this.statusTxt.setColor('#ff8888');
        this.statusTxt.setText(this.reasonText(result.reason));
      }
    }
  }

  private reasonText(reason?: string): string {
    switch (reason) {
      case 'no-stock': return 'Out of stock.';
      case 'no-money': return 'Not enough money.';
      case 'no-space': return 'Backpack is full.';
      case 'merchant-full': return "They're not buying any more right now.";
      case 'no-item': return 'Unknown item.';
      default: return 'Trade failed.';
    }
  }

  private render(): void {
    if (!this.current) return;
    const { shop } = this.current;
    const p = clientGameState.progression;

    this.titleTxt.setText(shop.shopName.toUpperCase());
    this.moneyTxt.setText(`Wallet: ₹${p?.money ?? 0}`);
    this.tabsTxt.setText(this.tab === 'buy' ? '< BUY    sell >' : '< buy    SELL >');

    for (const child of this.rowChildren) child.destroy();
    this.rowChildren = [];

    const list = this.activeList();
    if (list.length === 0) {
      const empty = this.scene.add.text(
        LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.45,
        this.tab === 'buy' ? 'Nothing for sale.' : "They aren't buying anything.",
        { fontSize: '32px', fontFamily: 'monospace', color: '#888899' },
      ).setOrigin(0.5).setScrollFactor(0).setDepth(31);
      this.add(empty);
      this.rowChildren.push(empty);
      return;
    }

    const startY = LOGICAL_HEIGHT * 0.32;
    const panelW = LOGICAL_WIDTH * 0.85 - PANEL_PADDING * 2;
    const panelX = LOGICAL_WIDTH / 2;

    for (let i = 0; i < list.length; i++) {
      const row = list[i]!;
      const def = ITEMS[row.itemId]!;
      const y = startY + i * (ROW_HEIGHT + 8);
      const isSel = i === this.cursor;

      const rowBg = this.scene.add.rectangle(
        panelX, y, panelW, ROW_HEIGHT,
        isSel ? 0x3a3a6a : 0x222238,
      ).setStrokeStyle(isSel ? 3 : 1, isSel ? 0xf5c842 : 0x3a3a5a)
        .setScrollFactor(0).setDepth(31);
      const icon = this.scene.add.rectangle(
        panelX - panelW / 2 + 40, y, 40, 40, def.iconColor,
      ).setScrollFactor(0).setDepth(32);
      const name = this.scene.add.text(
        panelX - panelW / 2 + 80, y, def.name,
        { fontSize: '28px', fontFamily: 'monospace', color: '#ffffff' },
      ).setOrigin(0, 0.5).setScrollFactor(0).setDepth(32);
      const qty = this.scene.add.text(
        panelX + panelW * 0.18, y, `x${row.qty}`,
        { fontSize: '26px', fontFamily: 'monospace', color: '#aaccff' },
      ).setOrigin(0, 0.5).setScrollFactor(0).setDepth(32);
      const price = this.scene.add.text(
        panelX + panelW / 2 - 20, y, `₹${row.price}`,
        { fontSize: '28px', fontFamily: 'monospace', color: '#f5c842', fontStyle: 'bold' },
      ).setOrigin(1, 0.5).setScrollFactor(0).setDepth(32);

      this.add([rowBg, icon, name, qty, price]);
      this.rowChildren.push(rowBg, icon, name, qty, price);
    }
  }
}
