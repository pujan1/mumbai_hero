import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import { elderFitnessDialogue } from '../../data/dialogues/elder-fitness.js';

export class HouseFitnessScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-fitness-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-fitness', tilesetKey: 'tileset-house',
      tilesetName: 'house',
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-fitness-scene',
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-fitness', 'Bala Bhai', 'npc-elder-fitness', elderFitnessDialogue);
  }

  spawnInteractables(): void {
    this.addInteractable(5, 10, 'house-fitness-exit', 'Exit', null, {
      sceneId: 'neighborhood-scene', spawnPoint: 'from-fitness',
    });
  }
}
