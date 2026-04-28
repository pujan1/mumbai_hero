import Phaser from 'phaser';
import type { DialogueTree } from '@mumbai-hero/shared';

export class NPC extends Phaser.GameObjects.Sprite {
  readonly npcId: string;
  readonly npcName: string;
  private dialogueTree: DialogueTree;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    npcId: string,
    npcName: string,
    spriteKey: string,
    dialogueTree: DialogueTree,
  ) {
    super(scene, x, y, spriteKey);
    this.npcId = npcId;
    this.npcName = npcName;
    this.dialogueTree = dialogueTree;
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
  }

  getDialogueTree(): DialogueTree {
    return this.dialogueTree;
  }

  setDialogueTree(tree: DialogueTree): void {
    this.dialogueTree = tree;
  }
}
