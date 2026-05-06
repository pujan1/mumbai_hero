import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import type { RoomLayout } from '../base-indoor-scene.js';
import { elderFitnessDialogue } from '../../data/dialogues/index.js';

export class HouseFitnessScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-fitness-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-fitness',
      tilesetKeys: ['tileset-house-arch', 'tileset-house-fitness-food'],
      tilesetNames: ['house-arch', 'house-fitness-food'],
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-fitness-scene',
    };
  }

  // Wide open rectangle — open gym floor plan
  getRoomLayout(): RoomLayout {
    return {
      totalCols: 18, totalRows: 12,
      sections: [{ col: 0, row: 0, cols: 18, rows: 12 }],
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-fitness', 'Bala Bhai', 'npc-elder-fitness', elderFitnessDialogue);
  }

  spawnInteractables(): void {
    this.addDoor(5, 10, 'house-fitness-exit', { sceneId: 'neighborhood-scene', spawnPoint: 'from-fitness' });
  }
}
