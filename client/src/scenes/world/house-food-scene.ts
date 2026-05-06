import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import type { RoomLayout } from '../base-indoor-scene.js';
import { elderFoodDialogue } from '../../data/dialogues/index.js';

export class HouseFoodScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-food-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-food',
      tilesetKeys: ['tileset-house-arch', 'tileset-house-fitness-food'],
      tilesetNames: ['house-arch', 'house-fitness-food'],
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-food-scene',
    };
  }

  // L-shape: main dining room + side kitchen wing
  getRoomLayout(): RoomLayout {
    return {
      totalCols: 17, totalRows: 12,
      sections: [
        { col: 0,  row: 0, cols: 12, rows: 12 },
        { col: 12, row: 5, cols: 5,  rows: 7  },
      ],
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-food', 'Uday Kaka', 'npc-elder-food', elderFoodDialogue);
  }

  spawnInteractables(): void {
    this.addDoor(5, 10, 'house-food-exit', { sceneId: 'neighborhood-scene', spawnPoint: 'from-food' });
  }
}
