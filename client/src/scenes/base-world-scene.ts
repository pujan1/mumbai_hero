import Phaser from 'phaser';
import { Player } from '../entities/player.js';
import { NPC, type NPCConfig } from '../entities/npc.js';
import { Interactable } from '../entities/interactable.js';
import { InteractionSystem } from '../systems/interaction-system.js';
import { initInputManager, justPressed } from '../systems/input-manager.js';
import { startDialogue, isDialogueOpen } from '../systems/dialogue-system.js';
import { transitionTo } from '../systems/scene-transition-manager.js';
import { talkToNpc, interactWithObject } from '../services/state-sync.js';
import { TILE_SIZE, LAYOUT } from '../config/constants.js';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';
import { getActiveOverlay } from '../systems/ui-state.js';
import { SpeechBubble } from '../ui/speech-bubble.js';
import type { DialogueTree, DialogueNode } from '@mumbai-hero/shared';

export type ContextHintKind = 'talk' | 'shop' | 'enter' | 'open' | null;
export interface ContextHint {
  kind: ContextHintKind;
  label?: string;
}

export interface WorldSceneConfig {
  mapKey: string;
  tilesetKeys: string[];
  tilesetNames: string[];
  spawnPoints: Record<string, { x: number; y: number }>;
  sceneId: string;
}

export abstract class BaseWorldScene extends Phaser.Scene {
  protected player!: Player;
  protected interactionSystem!: InteractionSystem;
  protected npcs: NPC[] = [];
  protected interactables: Interactable[] = [];
  protected collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  private isTransitioning = false;
  private speechBubble!: SpeechBubble;
  private dialogueUnsubs: Array<() => void> = [];
  private lastContextKey: string | null = null;

  // Solid tile positions populated by subclasses (e.g. building footprints).
  // Key format: "col,row". Checked in isColliding() before tilemap layer.
  protected solidTiles = new Set<string>();

  abstract getSceneConfig(): WorldSceneConfig;
  abstract spawnNPCs(): void;
  abstract spawnInteractables(): void;

  protected abstract buildWorld(): void;

  create(data: { spawnPoint?: string }): void {
    this.isTransitioning = false;
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
      0, LAYOUT.HUD_HEIGHT,
      this.scale.width, LAYOUT.GAME_HEIGHT,
    );

    this.spawnNPCs();
    this.spawnInteractables();
    this.interactables.forEach((i) => this.interactionSystem.register(i));

    this.speechBubble = new SpeechBubble(this);
    this.setupDialogueRouting();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.teardownDialogueRouting());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.teardownDialogueRouting());
  }

  private setupDialogueRouting(): void {
    const onShow = (...args: unknown[]) => {
      const node = args[0] as DialogueNode;
      const lineIndex = args[1] as number;
      const line = node.lines[lineIndex];
      if (!line) return;

      const target = line.speaker ? this.resolveSpeaker(line.speaker, line.isPlayer === true) : null;
      if (target) {
        this.speechBubble.show(target, line.text, line.isPlayer === true);
        eventBus.emit('dialogue:panel:hide');
      } else {
        // Narration, or speaker not in this scene → fall back to bottom panel.
        this.speechBubble.hideImmediate();
        eventBus.emit('dialogue:panel:show', node, lineIndex);
      }
    };
    const onChoices = () => {
      this.speechBubble.hideImmediate();
    };
    const onHide = () => {
      this.speechBubble.hideImmediate();
    };

    this.dialogueUnsubs.push(
      eventBus.on('dialogue:show', onShow),
      eventBus.on('dialogue:choices', onChoices),
      eventBus.on('dialogue:hide', onHide),
    );
  }

  private teardownDialogueRouting(): void {
    this.dialogueUnsubs.forEach((unsub) => unsub());
    this.dialogueUnsubs = [];
    this.lastContextKey = null;
    eventBus.emit('context:hint', { kind: null });
  }

  private resolveSpeaker(speakerName: string, isPlayer: boolean): Player | NPC | null {
    if (isPlayer) return this.player;
    return this.npcs.find((n) => n.npcName === speakerName) ?? null;
  }

  protected addNPC(
    tileX: number,
    tileY: number,
    npcId: string,
    npcName: string,
    spriteKey: string,
    dialogue: DialogueTree,
    config: NPCConfig = {},
  ): NPC {
    const npc = new NPC(
      this,
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + TILE_SIZE,
      npcId,
      npcName,
      spriteKey,
      dialogue,
      config,
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
    this.speechBubble?.refreshPosition();

    const overlay = getActiveOverlay();
    if (overlay === 'shop') {
      this.routeShopInput();
      return;
    }
    if (overlay === 'backpack') {
      // BackpackOverlay's open/close is handled by HUDScene's keydown-I, but
      // X/cancel should also close it.
      if (justPressed('cancel')) {
        eventBus.emit('backpack:toggle');
      }
      return;
    }

    if (isDialogueOpen()) {
      this.emitContext({ kind: null });
      if (justPressed('action')) {
        const hudScene = this.scene.get('hud-scene') as unknown as { getDialogueBox: () => import('../ui/dialogue-box.js').DialogueBox };
        hudScene.getDialogueBox().onAdvance();
      }
      return;
    }

    this.player.update(delta, (nx, ny) => this.isColliding(nx, ny));

    // Walk onto a door tile → auto-transition (Pokémon-style, no button needed)
    if (!this.isTransitioning) {
      const door = this.findAutoTriggerAtPlayerTile();
      if (door) {
        this.isTransitioning = true;
        door.onInteract();
        return;
      }
    }

    const facingNPC = this.findNearestNPC();
    const nearest = facingNPC ? null : this.findNearestInteractable();
    this.emitContext(this.contextFor(facingNPC, nearest));

    // Action button: talk to the facing NPC, or interact with a non-door object
    if (justPressed('action')) {
      if (facingNPC) {
        if (facingNPC.shop) {
          // Shopkeeper / vendor: skip dialogue, open trade window directly.
          void talkToNpc({ npcId: facingNPC.npcId });
          eventBus.emit('shop:open', {
            shop: facingNPC.shop,
            merchant: facingNPC.asInventoryHolder(),
          });
          return;
        }
        void talkToNpc({ npcId: facingNPC.npcId });
        startDialogue(facingNPC.getDialogueTree(), (callbackId) => {
          this.handleDialogueCallback(callbackId, facingNPC.npcId);
        });
      } else if (nearest && !nearest.autoTrigger) {
        nearest.onInteract();
      }
    }
  }

  private contextFor(facingNPC: NPC | null, nearest: Interactable | null): ContextHint {
    if (facingNPC) return { kind: facingNPC.shop ? 'shop' : 'talk' };
    if (nearest && !nearest.autoTrigger) {
      const hint: ContextHint = { kind: 'open' };
      if (nearest.label) hint.label = nearest.label;
      return hint;
    }
    return { kind: null };
  }

  private emitContext(hint: ContextHint): void {
    const key = `${hint.kind ?? ''}|${hint.label ?? ''}`;
    if (key === this.lastContextKey) return;
    this.lastContextKey = key;
    eventBus.emit('context:hint', hint);
  }

  private routeShopInput(): void {
    const hud = this.scene.get('hud-scene') as unknown as {
      getShop: () => import('../ui/shop-overlay.js').ShopOverlay;
    };
    const shop = hud.getShop();
    if (justPressed('up'))      shop.handleInput('up');
    if (justPressed('down'))    shop.handleInput('down');
    if (justPressed('left'))    shop.handleInput('left');
    if (justPressed('right'))   shop.handleInput('right');
    if (justPressed('action'))  shop.handleInput('action');
    if (justPressed('cancel'))  shop.handleInput('cancel');
  }

  private isColliding(worldX: number, worldY: number): boolean {
    const { x, y, width, height } = this.physics.world.bounds;
    if (worldX < x || worldY < y || worldX >= x + width || worldY >= y + height) return true;
    const tc = Math.floor(worldX / TILE_SIZE);
    const tr = Math.floor(worldY / TILE_SIZE);
    if (this.solidTiles.has(`${tc},${tr}`)) return true;
    // Block the tile any NPC occupies so the player can't walk through them
    for (const npc of this.npcs) {
      const nc = Math.floor(npc.x / TILE_SIZE);
      const nr = Math.floor((npc.y - TILE_SIZE / 2) / TILE_SIZE);
      if (tc === nc && tr === nr) return true;
    }
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
