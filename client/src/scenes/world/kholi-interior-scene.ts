import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import {
  bedDialogue,
  stoveDialogue,
  mirrorDialogue,
  familyPhotoDialogue,
  kholiDoorDialogue,
} from '../../data/dialogues/household-objects.js';

export class KholiInteriorScene extends BaseIndoorScene {
  constructor() {
    super({ key: 'kholi-interior-scene' });
  }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-kholi',
      tilesetKey: 'tileset-kholi',
      tilesetName: 'kholi',
      spawnPoints: {
        default: { x: 5, y: 8 },
        'from-door': { x: 5, y: 9 },
      },
      sceneId: 'kholi-interior-scene',
    };
  }

  spawnNPCs(): void {
    // No NPCs in the kholi for MVP
  }

  spawnInteractables(): void {
    this.addInteractable(5, 2, 'kholi-bed', 'Bed', bedDialogue);
    this.addInteractable(2, 5, 'kholi-stove', 'Stove', stoveDialogue);
    this.addInteractable(9, 3, 'kholi-mirror', 'Mirror', mirrorDialogue);
    this.addInteractable(1, 2, 'kholi-photo', 'Family Photo', familyPhotoDialogue);
    this.addInteractable(5, 10, 'kholi-door', 'Door', kholiDoorDialogue, {
      sceneId: 'neighborhood-scene',
      spawnPoint: 'kholi-door',
    });
  }
}
