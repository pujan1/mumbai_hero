import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import { elderBollywoodDialogue } from '../../data/dialogues/elder-bollywood.js';

export class HouseBollywoodScene extends BaseIndoorScene {
  constructor() { super({ key: 'house-bollywood-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-bollywood', tilesetKey: 'tileset-house',
      tilesetName: 'house',
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-bollywood-scene',
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-bollywood', 'Ramesh Ji', 'npc-elder-bollywood', elderBollywoodDialogue);
  }

  spawnInteractables(): void {
    this.addInteractable(5, 10, 'house-bollywood-exit', 'Exit', null, {
      sceneId: 'neighborhood-scene', spawnPoint: 'from-bollywood',
    });
  }
}
