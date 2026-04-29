import { BaseIndoorScene } from '../base-indoor-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
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

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-cinema', 'Sunita Madam', 'npc-elder-cinema', elderCinemaDialogue);
  }

  spawnInteractables(): void {
    this.addInteractable(5, 10, 'house-cinema-exit', 'Exit', null, {
      sceneId: 'neighborhood-scene', spawnPoint: 'from-cinema',
    });
  }
}
