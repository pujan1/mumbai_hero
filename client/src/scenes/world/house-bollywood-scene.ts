import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import type { RoomLayout } from '../base-indoor-scene.js';
import { elderBollywoodDialogue } from '../../data/dialogues/index.js';

export class HouseBollywoodScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-bollywood-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-bollywood',
      tilesetKeys: ['tileset-house-arch', 'tileset-house-shared'],
      tilesetNames: ['house-arch', 'house-shared'],
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-bollywood-scene',
    };
  }

  // L-shape: large main hall + private study wing on the right
  getRoomLayout(): RoomLayout {
    return {
      totalCols: 17, totalRows: 12,
      sections: [
        { col: 0,  row: 0, cols: 12, rows: 12 },
        { col: 12, row: 0, cols: 5,  rows: 7  },
      ],
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-bollywood', 'Ramesh Ji', 'npc-elder-bollywood', elderBollywoodDialogue);
  }

  spawnInteractables(): void {
    this.addDoor(5, 10, 'house-bollywood-exit', { sceneId: 'neighborhood-scene', spawnPoint: 'from-bollywood' });
  }
}
