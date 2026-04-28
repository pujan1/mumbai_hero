import { BaseWorldScene } from '../base-world-scene.js';
import type { WorldSceneConfig } from '../base-world-scene.js';
import { elderMusicDialogue } from '../../data/dialogues/elder-music.js';

export class HouseMusicScene extends BaseWorldScene {
  constructor() { super({ key: 'house-music-scene' }); }

  getSceneConfig(): WorldSceneConfig {
    return {
      mapKey: 'map-house-music', tilesetKey: 'tileset-house',
      tilesetName: 'house',
      spawnPoints: { default: { x: 5, y: 8 } },
      sceneId: 'house-music-scene',
    };
  }

  spawnNPCs(): void {
    this.addNPC(5, 4, 'elder-music', 'Meena Tai', 'npc-elder-music', elderMusicDialogue);
  }

  spawnInteractables(): void {
    this.addInteractable(5, 10, 'house-music-exit', 'Exit', null, {
      sceneId: 'neighborhood-scene', spawnPoint: 'from-music',
    });
  }
}
