import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import type { RoomLayout } from '../base-indoor-scene.js';
import { elderCinemaDialogue } from '../../data/dialogues/elder-cinema.js';

export class HouseCinemaScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-cinema-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-cinema', tilesetKey: 'tileset-house',
      tilesetName: 'house',
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-cinema-scene',
    };
  }

  // Wider rectangle — room for a viewing/screening area
  getRoomLayout(): RoomLayout {
    return {
      totalCols: 14, totalRows: 12,
      sections: [{ col: 0, row: 0, cols: 14, rows: 12 }],
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-cinema', 'Sunita Madam', 'npc-elder-cinema', elderCinemaDialogue);
  }

  spawnInteractables(): void {
    this.addDoor(5, 10, 'house-cinema-exit', { sceneId: 'neighborhood-scene', spawnPoint: 'from-cinema' });
  }
}
