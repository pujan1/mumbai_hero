import { BaseOutdoorScene } from '../base-outdoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import { TILE_SIZE } from '../../config/constants.js';
import { getFastTravelNodes } from '../../systems/fast-travel-system.js';
import type { DialogueTree } from '@mumbai-hero/shared';

const comingSoonDialogue: DialogueTree = {
  id: 'coming-soon',
  startNode: 'start',
  nodes: [{ id: 'start', lines: [{ speaker: '', text: 'Coming soon to this neighbourhood!' }] }],
};

const lockedDialogue: DialogueTree = {
  id: 'locked',
  startNode: 'start',
  nodes: [{ id: 'start', lines: [{ speaker: '', text: 'The door is locked.' }] }],
};

const ambientDialogues: Record<string, DialogueTree> = {
  'ambient-chai': {
    id: 'ambient-chai',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Chai Wallah', text: 'Chai? Cutting? Special today, only five rupees!' }] }],
  },
  'ambient-cricket': {
    id: 'ambient-cricket',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Cricket Kid', text: 'Dada, you want to play? I need a fielder!' }] }],
  },
  'ambient-laundry': {
    id: 'ambient-laundry',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Laundry Aunty', text: 'Arre, you look like you need a good home-cooked meal.' }] }],
  },
  'ambient-vendor': {
    id: 'ambient-vendor',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Vegetable Vendor', text: 'Fresh tomatoes, twenty rupees a kilo! Best in the area!' }] }],
  },
  'ambient-dog': {
    id: 'ambient-dog',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: '', text: 'The dog wags its tail and sniffs your hand. A friend.' }] }],
  },
};

export class NeighborhoodScene extends BaseOutdoorScene {
  constructor() {
    super({ key: 'neighborhood-scene' });
  }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-neighborhood',
      tilesetKey: 'tileset-neighborhood',
      tilesetName: 'neighborhood',
      spawnPoints: {
        default: { x: 6, y: 8 },
        'kholi-door': { x: 6, y: 9 },
        'from-bollywood': { x: 4, y: 5 },
        'from-music': { x: 8, y: 5 },
        'from-textile': { x: 12, y: 5 },
        'from-fitness': { x: 16, y: 5 },
        'from-food': { x: 4, y: 12 },
        'from-cinema': { x: 8, y: 12 },
      },
      sceneId: 'neighborhood-scene',
    };
  }

  spawnNPCs(): void {
    this.addNPC(3, 10, 'ambient-chai-wallah', 'Chai Wallah', 'npc-chai-wallah', ambientDialogues['ambient-chai']!);
    this.addNPC(15, 8, 'ambient-cricket-kid', 'Cricket Kid', 'npc-cricket-kid', ambientDialogues['ambient-cricket']!);
    this.addNPC(18, 6, 'ambient-laundry-aunty', 'Laundry Aunty', 'npc-laundry-aunty', ambientDialogues['ambient-laundry']!);
    this.addNPC(20, 12, 'ambient-vendor', 'Vegetable Vendor', 'npc-vendor', ambientDialogues['ambient-vendor']!);
    this.addNPC(10, 14, 'ambient-dog', 'Street Dog', 'npc-dog', ambientDialogues['ambient-dog']!);
  }

  spawnInteractables(): void {
    this.addDoor(6, 7, 'kholi-door-ext', { sceneId: 'kholi-interior-scene', spawnPoint: 'from-door' });

    this.addDoor(4, 4,   'house-bollywood-door', { sceneId: 'house-bollywood-scene', spawnPoint: 'default' });
    this.addDoor(8, 4,   'house-music-door',     { sceneId: 'house-music-scene',     spawnPoint: 'default' });
    this.addDoor(12, 4,  'house-textile-door',   { sceneId: 'house-textile-scene',   spawnPoint: 'default' });
    this.addDoor(16, 4,  'house-fitness-door',   { sceneId: 'house-fitness-scene',   spawnPoint: 'default' });
    this.addDoor(4, 11,  'house-food-door',      { sceneId: 'house-food-scene',      spawnPoint: 'default' });
    this.addDoor(8, 11,  'house-cinema-door',    { sceneId: 'house-cinema-scene',    spawnPoint: 'default' });

    this.addInteractable(12, 11, 'building-shop-1', 'Kirana Store', comingSoonDialogue);
    this.addInteractable(16, 11, 'building-shop-2', 'Medical', comingSoonDialogue);
    this.addInteractable(20, 8, 'building-office-1', 'Office', comingSoonDialogue);
    this.addInteractable(22, 12, 'building-unknown-1', 'House', lockedDialogue);

    this.addFastTravelTriggers();
  }

  private addFastTravelTriggers(): void {
    getFastTravelNodes().forEach((node) => {
      const stubTree: DialogueTree = {
        id: `fast-travel-${node.id}`,
        startNode: 'start',
        nodes: [{ id: 'start', lines: [{ speaker: '', text: node.stubDialogue }] }],
      };
      this.addInteractable(node.tileX, node.tileY, node.id, node.label, stubTree);
    });
  }

  create(data: { spawnPoint?: string }): void {
    super.create(data);
    this.addTrainAnimation();
    this.addBusAnimation();
  }

  private addTrainAnimation(): void {
    const train = this.add.rectangle(
      20 * TILE_SIZE + TILE_SIZE / 2, 2 * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE * 3, TILE_SIZE, 0xff6600,
    );
    this.tweens.add({
      targets: train,
      x: train.x + TILE_SIZE * 5,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private addBusAnimation(): void {
    const bus = this.add.rectangle(
      3 * TILE_SIZE + TILE_SIZE / 2, 2 * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE * 2, TILE_SIZE, 0xcc0000,
    );
    this.tweens.add({
      targets: bus,
      x: bus.x + TILE_SIZE * 2,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1500,
    });
  }
}
