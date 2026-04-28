import Phaser from 'phaser';
import { Player } from '../entities/player.js';
import { NPC } from '../entities/npc.js';
import { Interactable } from '../entities/interactable.js';
import { InteractionSystem } from '../systems/interaction-system.js';
import { initInputManager, justPressed } from '../systems/input-manager.js';
import { startDialogue, isDialogueOpen } from '../systems/dialogue-system.js';
import { transitionTo } from '../systems/scene-transition-manager.js';
import { talkToNpc, interactWithObject } from '../services/state-sync.js';
import { TILE_SIZE, LAYOUT } from '../config/constants.js';
import type { DialogueTree } from '@mumbai-hero/shared';

export interface WorldSceneConfig {
  mapKey: string;
  tilesetKey: string;
  tilesetName: string;
  spawnPoints: Record<string, { x: number; y: number }>;
  sceneId: string;
}

export abstract class BaseWorldScene extends Phaser.Scene {
  protected player!: Player;
  protected interactionSystem!: InteractionSystem;
  protected npcs: NPC[] = [];
  protected interactables: Interactable[] = [];
  private collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;

  abstract getSceneConfig(): WorldSceneConfig;
  abstract spawnNPCs(): void;
  abstract spawnInteractables(): void;

  create(data: { spawnPoint?: string }): void {
    const cfg = this.getSceneConfig();
    initInputManager(this);
    this.interactionSystem = new InteractionSystem();

    this.buildPlaceholderWorld();

    const spawnId = data.spawnPoint ?? 'default';
    const spawnPos = cfg.spawnPoints[spawnId] ?? cfg.spawnPoints['default'] ?? { x: 3, y: 3 };
    const spriteKey = 'player-boy';

    this.player = new Player(
      this,
      spawnPos.x * TILE_SIZE + TILE_SIZE / 2,
      spawnPos.y * TILE_SIZE + TILE_SIZE / 2,
      spriteKey,
    );

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setViewport(
      0, LAYOUT.HUD_HEIGHT + LAYOUT.DIALOGUE_HEIGHT,
      this.scale.width, LAYOUT.GAME_HEIGHT,
    );

    this.spawnNPCs();
    this.spawnInteractables();
    this.interactables.forEach((i) => this.interactionSystem.register(i));
  }

  private buildPlaceholderWorld(): void {
    const cols = 24;
    const rows = 18;
    const totalW = cols * TILE_SIZE;
    const totalH = rows * TILE_SIZE;

    this.add.rectangle(totalW / 2, totalH / 2, totalW, totalH, 0x335533);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          this.add.rectangle(
            c * TILE_SIZE + TILE_SIZE / 2,
            r * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE, TILE_SIZE, 0x555555,
          );
        }
      }
    }

    this.physics.world.setBounds(0, 0, totalW, totalH);
    this.cameras.main.setBounds(0, 0, totalW, totalH);
  }

  protected addNPC(
    tileX: number,
    tileY: number,
    npcId: string,
    npcName: string,
    spriteKey: string,
    dialogue: DialogueTree,
  ): NPC {
    const npc = new NPC(
      this,
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + TILE_SIZE,
      npcId,
      npcName,
      spriteKey,
      dialogue,
    );
    this.npcs.push(npc);
    return npc;
  }

  protected addInteractable(
    tileX: number,
    tileY: number,
    id: string,
    label: string,
    dialogueTree: DialogueTree | null,
    transition?: { sceneId: string; spawnPoint?: string },
  ): Interactable {
    const worldX = tileX * TILE_SIZE + TILE_SIZE / 2;
    const worldY = tileY * TILE_SIZE + TILE_SIZE / 2;

    const onInteract = () => {
      if (transition) {
        void transitionTo(this, transition);
        return;
      }
      if (dialogueTree) {
        void interactWithObject({ objectId: id });
        startDialogue(dialogueTree);
      }
    };

    const interactable = new Interactable(this, { id, label, x: worldX, y: worldY, onInteract });
    this.interactables.push(interactable);
    return interactable;
  }

  update(_time: number, delta: number): void {
    if (isDialogueOpen()) {
      if (justPressed('action')) {
        const hudScene = this.scene.get('hud-scene') as unknown as { getDialogueBox: () => import('../ui/dialogue-box.js').DialogueBox };
        hudScene.getDialogueBox().onAdvance();
      }
      return;
    }

    this.player.update(delta, (nx, ny) => this.isColliding(nx, ny));

    if (justPressed('action')) {
      const nearest = this.findNearestInteractable() ?? this.findNearestNPC();
      if (nearest) {
        if (nearest instanceof NPC) {
          void talkToNpc({ npcId: nearest.npcId });
          startDialogue(nearest.getDialogueTree(), (callbackId) => {
            this.handleDialogueCallback(callbackId, nearest.npcId);
          });
        } else {
          nearest.onInteract();
        }
      }
    }
  }

  private isColliding(worldX: number, worldY: number): boolean {
    if (!this.collisionLayer) {
      if (worldX < 0 || worldY < 0) return true;
      return false;
    }
    const tile = this.collisionLayer.getTileAtWorldXY(worldX, worldY);
    return tile !== null && tile.collides;
  }

  private findNearestInteractable(): Interactable | null {
    const px = this.player.x;
    const py = this.player.y;
    const ox = this.player.facingTileOffsetX;
    const oy = this.player.facingTileOffsetY;
    return this.interactionSystem.getInteractableAt(px, py, ox, oy);
  }

  private findNearestNPC(): NPC | null {
    const px = Math.floor(this.player.x / TILE_SIZE);
    const py = Math.floor(this.player.y / TILE_SIZE);
    const ox = this.player.facingTileOffsetX;
    const oy = this.player.facingTileOffsetY;
    const tx = px + ox;
    const ty = py + oy;

    for (const npc of this.npcs) {
      const nx = Math.floor(npc.x / TILE_SIZE);
      const ny = Math.floor((npc.y - TILE_SIZE / 2) / TILE_SIZE);
      if (nx === tx && ny === ty) return npc;
    }
    return null;
  }

  protected handleDialogueCallback(callbackId: string, _npcId: string): void {
    if (callbackId.startsWith('accept-')) {
      const storylineId = callbackId.replace('accept-', '');
      import('../services/state-sync.js').then(({ acceptStoryline }) => {
        void acceptStoryline({ storylineId });
      });
    } else if (callbackId.startsWith('decline-')) {
      const storylineId = callbackId.replace('decline-', '');
      import('../services/state-sync.js').then(({ declineStoryline }) => {
        void declineStoryline({ storylineId });
      });
    }
  }
}
