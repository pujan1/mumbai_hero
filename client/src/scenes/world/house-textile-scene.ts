import { BaseWorldScene } from '../base-world-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import { elderTextileDialogue } from '../../data/dialogues/elder-textile.js';

export class HouseTextileScene extends BaseWorldScene {
  constructor() { super({ key: 'house-textile-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-textile', tilesetKey: 'tileset-house',
      tilesetName: 'house',
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-textile-scene',
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-textile', 'Harishbhai', 'npc-elder-textile', elderTextileDialogue);
  }

  spawnInteractables(): void {
    this.addInteractable(5, 10, 'house-textile-exit', 'Exit', null, {
      sceneId: 'neighborhood-scene', spawnPoint: 'from-textile',
    });
  }
}
