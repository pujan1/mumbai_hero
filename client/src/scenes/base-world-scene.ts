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
import { clientGameState } from '../state/game-state.js';
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
  private isTransitioning = false;

  abstract getSceneConfig(): WorldSceneConfig;
  abstract spawnNPCs(): void;
  abstract spawnInteractables(): void;

  protected abstract buildWorld(): void;

  create(data: { spawnPoint?: string }): void {
    const cfg = this.getSceneConfig();
    initInputManager(this);
    this.interactionSystem = new InteractionSystem();

    this.buildWorld();

    const spawnId = data.spawnPoint ?? 'default';
    const spawnPos = cfg.spawnPoints[spawnId] ?? cfg.spawnPoints['default'] ?? { x: 3, y: 3 };
    const choice = clientGameState.profile?.characterChoice ?? 'boy';
    const spriteKey = `player-${choice}`;

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

  protected addDoor(
    tileX: number,
    tileY: number,
    id: string,
    transition: { sceneId: string; spawnPoint?: string },
  ): void {
    const wx = tileX * TILE_SIZE + TILE_SIZE / 2;
    const wy = tileY * TILE_SIZE + TILE_SIZE / 2;

    // Door frame (dark wood border)
    this.add.rectangle(wx, wy, TILE_SIZE, TILE_SIZE, 0x5C3317).setDepth(0.5);
    // Door panel (lighter inset)
    this.add.rectangle(wx, wy - 2, TILE_SIZE - 6, TILE_SIZE - 10, 0x8B4513).setDepth(0.6);
    // Brass knob
    this.add.rectangle(wx + 7, wy - 2, 3, 3, 0xFFD700).setDepth(0.7);

    const onInteract = (): void => { void transitionTo(this, transition); };
    const interactable = new Interactable(this, {
      id, label: '', x: wx, y: wy, onInteract, autoTrigger: true,
    });
    this.interactables.push(interactable);
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

    // Walk onto a door tile → auto-transition (Pokemon-style, no button needed)
    if (!this.isTransitioning) {
      const door = this.findAutoTriggerAtPlayerTile();
      if (door) {
        this.isTransitioning = true;
        door.onInteract();
        return;
      }
    }

    if (justPressed('action')) {
      const nearest = this.findNearestInteractable() ?? this.findNearestNPC();
      if (nearest) {
        if (nearest instanceof NPC) {
          void talkToNpc({ npcId: nearest.npcId });
          startDialogue(nearest.getDialogueTree(), (callbackId) => {
            this.handleDialogueCallback(callbackId, nearest.npcId);
          });
        } else if (!nearest.autoTrigger) {
          // Don't re-fire doors via action button — they're walk-on only
          nearest.onInteract();
        }
      }
    }
  }

  private isColliding(worldX: number, worldY: number): boolean {
    const { x, y, width, height } = this.physics.world.bounds;
    if (worldX < x || worldY < y || worldX >= x + width || worldY >= y + height) return true;
    if (!this.collisionLayer) return false;
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

  private findAutoTriggerAtPlayerTile(): Interactable | null {
    const px = Math.floor(this.player.x / TILE_SIZE);
    const py = Math.floor(this.player.y / TILE_SIZE);
    for (const interactable of this.interactables) {
      if (!interactable.autoTrigger) continue;
      const ix = Math.floor(interactable.x / TILE_SIZE);
      const iy = Math.floor(interactable.y / TILE_SIZE);
      if (px === ix && py === iy) return interactable;
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
