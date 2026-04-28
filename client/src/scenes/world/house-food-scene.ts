import { BaseWorldScene } from '../base-world-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import { elderFoodDialogue } from '../../data/dialogues/elder-food.js';

export class HouseFoodScene extends BaseWorldScene {
  constructor() { super({ key: 'house-food-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-food', tilesetKey: 'tileset-house',
      tilesetName: 'house',
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-food-scene',
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-food', 'Uday Kaka', 'npc-elder-food', elderFoodDialogue);
  }

  spawnInteractables(): void {
    this.addInteractable(5, 10, 'house-food-exit', 'Exit', null, {
      sceneId: 'neighborhood-scene', spawnPoint: 'from-food',
    });
  }
}
