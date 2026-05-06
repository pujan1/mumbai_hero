import { Scene } from 'phaser';
import { enterScene } from '../services/state-sync.js';

export interface TransitionTarget {
  sceneId: string;
  spawnPoint?: string;
}

export async function transitionTo(
  currentScene: Scene,
  target: TransitionTarget,
): Promise<void> {
  const req = target.spawnPoint
    ? { sceneId: target.sceneId, spawnPoint: target.spawnPoint }
    : { sceneId: target.sceneId };
  await enterScene(req);
  currentScene.scene.start(target.sceneId, { spawnPoint: target.spawnPoint ?? 'default' });
}
