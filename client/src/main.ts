import { Game } from 'phaser';
import { gameConfig } from './config/game-config.js';

const game = new Game(gameConfig);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    game.destroy(true);
  });
}
