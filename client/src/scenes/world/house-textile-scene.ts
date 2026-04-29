import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import type { RoomLayout } from '../base-indoor-scene.js';
import { elderTextileDialogue } from '../../data/dialogues/elder-textile.js';

export class HouseTextileScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-textile-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-textile', tilesetKey: 'tileset-house',
      tilesetName: 'house',
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-textile-scene',
    };
  }

  // L-shape: main room + back workshop extension below-left
  getRoomLayout(): RoomLayout {
    return {
      totalCols: 12, totalRows: 17,
      sections: [
        { col: 0, row: 0,  cols: 12, rows: 12 },
        { col: 0, row: 12, cols: 6,  rows: 5  },
      ],
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-textile', 'Harishbhai', 'npc-elder-textile', elderTextileDialogue);
  }

  spawnInteractables(): void {
    this.addDoor(5, 10, 'house-textile-exit', { sceneId: 'neighborhood-scene', spawnPoint: 'from-textile' });
  }
}
