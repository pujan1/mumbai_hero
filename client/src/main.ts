import Phaser from 'phaser';
import { gameConfig } from './config/game-config.js';

const game = new Phaser.Game(gameConfig);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    game.destroy(true);
  });
}
