import Phaser from 'phaser';
import type { DialogueTree, InventoryItem } from '@mumbai-hero/shared';
import type { InventoryHolder } from '../systems/inventory-system.js';

// Shopkeepers and any NPC that can trade. The arrays are item ids — actual
// quantities/prices come from the shared ITEMS registry and from `inventory`.
export interface ShopConfig {
  // Marketing label used in the shop window header (e.g. "Tomato Cart").
  shopName: string;
  // Items the merchant will sell from their inventory.
  sells: string[];
  // Items the merchant will buy from the player.
  buys: string[];
}

export interface NPCConfig {
  inventory?: InventoryItem[];
  inventoryCapacity?: number;
  shop?: ShopConfig;
}

export class NPC extends Phaser.GameObjects.Sprite {
  readonly npcId: string;
  readonly npcName: string;
  // Mutable so trades update what the merchant has on hand.
  inventory: InventoryItem[];
  inventoryCapacity: number;
  readonly shop: ShopConfig | undefined;
  private dialogueTree: DialogueTree;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    npcId: string,
    npcName: string,
    spriteKey: string,
    dialogueTree: DialogueTree,
    config: NPCConfig = {},
  ) {
    super(scene, x, y, spriteKey);
    this.npcId = npcId;
    this.npcName = npcName;
    this.dialogueTree = dialogueTree;
    this.inventory = config.inventory ?? [];
    this.inventoryCapacity = config.inventoryCapacity ?? 100;
    this.shop = config.shop;
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(1);
    const animKey = `${spriteKey}-idle-down`;
    if (scene.anims.exists(animKey)) this.play(animKey);
  }

  getDialogueTree(): DialogueTree {
    return this.dialogueTree;
  }

  setDialogueTree(tree: DialogueTree): void {
    this.dialogueTree = tree;
  }

  // Adapter for the generic inventory operations (add/remove/buy/sell).
  asInventoryHolder(): InventoryHolder {
    return { inventory: this.inventory, capacity: this.inventoryCapacity };
  }
}
