import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import type { RoomLayout } from '../base-indoor-scene.js';
import { elderMusicDialogue } from '../../data/dialogues/index.js';

export class HouseMusicScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-music-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-music',
      tilesetKeys: ['tileset-house-arch', 'tileset-house-music-textile'],
      tilesetNames: ['house-arch', 'house-music-textile'],
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-music-scene',
    };
  }

  // Tall narrow rectangle — like a small concert hall / practice room
  getRoomLayout(): RoomLayout {
    return {
      totalCols: 10, totalRows: 15,
      sections: [{ col: 0, row: 0, cols: 10, rows: 15 }],
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-music', 'Meena Tai', 'npc-elder-music', elderMusicDialogue);
  }

  spawnInteractables(): void {
    this.addDoor(5, 10, 'house-music-exit', { sceneId: 'neighborhood-scene', spawnPoint: 'from-music' });
  }
}
