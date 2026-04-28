import Phaser from 'phaser';
import { getPlayerId, getCachedState } from '../services/local-cache.js';
import { loadState, setOfflineState } from '../services/state-sync.js';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot-scene' });
  }

  preload(): void {
    this.createPlaceholderTextures();
  }

  private createPlaceholderTextures(): void {
    const sprites: { key: string; color: number }[] = [
      { key: 'player-boy', color: 0x4488ff },
      { key: 'player-girl', color: 0xff88cc },
      { key: 'npc-elder-bollywood', color: 0xffaa00 },
      { key: 'npc-elder-music', color: 0xaa44ff },
      { key: 'npc-elder-textile', color: 0x44ffaa },
      { key: 'npc-elder-fitness', color: 0xff4444 },
      { key: 'npc-elder-food', color: 0xff8844 },
      { key: 'npc-elder-cinema', color: 0x44aaff },
      { key: 'npc-chai-wallah', color: 0xcc8844 },
      { key: 'npc-cricket-kid', color: 0x44cc44 },
      { key: 'npc-laundry-aunty', color: 0x44cccc },
      { key: 'npc-vendor', color: 0x888844 },
      { key: 'npc-dog', color: 0xcc9966 },
    ];

    const tilesets: { key: string; color: number }[] = [
      { key: 'tileset-kholi', color: 0x886644 },
      { key: 'tileset-neighborhood', color: 0x667744 },
      { key: 'tileset-train', color: 0x445566 },
      { key: 'tileset-house', color: 0x996644 },
    ];

    [...sprites, ...tilesets].forEach(({ key, color }) => {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(color);
      g.fillRect(0, 0, 32, 32);
      g.generateTexture(key, 32, 32);
      g.destroy();
    });

    this.createAnimations();
  }

  private createAnimations(): void {
    ['player-boy', 'player-girl'].forEach((key) => {
      ['down', 'up', 'left', 'right'].forEach((dir) => {
        if (!this.anims.exists(`${key.replace('player-', 'player')}-walk-${dir}`)) {
          this.anims.create({
            key: `player-walk-${dir}`,
            frames: [{ key, frame: 0 }],
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: `player-idle-${dir}`,
            frames: [{ key, frame: 0 }],
            frameRate: 1,
            repeat: -1,
          });
        }
      });
    });
  }

  async create(): Promise<void> {
    const playerId = getPlayerId();

    if (!playerId) {
      this.scene.start('title-scene');
      return;
    }

    try {
      const state = await loadState();
      clientGameState.profile = state.profile;
      clientGameState.progression = state.progression;
      clientGameState.isOffline = false;
      clientGameState.isLoaded = true;
      eventBus.emit('state:updated', state.progression, []);
    } catch {
      const cached = getCachedState();
      if (cached) {
        const fakeProfile = {
          playerId,
          displayName: null,
          characterChoice: 'boy' as const,
          createdAt: new Date().toISOString(),
          lastPlayedAt: new Date().toISOString(),
          saveVersion: 1,
        };
        setOfflineState(fakeProfile, cached);
        clientGameState.profile = fakeProfile;
        clientGameState.progression = cached;
        clientGameState.isOffline = true;
        clientGameState.isLoaded = true;
      } else {
        this.scene.start('title-scene');
        return;
      }
    }

    const sceneId = clientGameState.progression?.currentScene ?? 'kholi-interior-scene';
    this.scene.launch('hud-scene');
    this.scene.start(sceneId);
  }
}
