import { AUTO, Scale, type Types } from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from './constants.js';
import { BootScene } from '../scenes/boot-scene.js';
import { TitleScene } from '../scenes/title-scene.js';
import { HUDScene } from '../scenes/hud-scene.js';
import { KholiInteriorScene } from '../scenes/world/kholi-interior-scene.js';
import { NeighborhoodScene } from '../scenes/world/neighborhood-scene.js';
import { HouseBollywoodScene } from '../scenes/world/house-bollywood-scene.js';
import { HouseMusicScene } from '../scenes/world/house-music-scene.js';
import { HouseTextileScene } from '../scenes/world/house-textile-scene.js';
import { HouseFitnessScene } from '../scenes/world/house-fitness-scene.js';
import { HouseFoodScene } from '../scenes/world/house-food-scene.js';
import { HouseCinemaScene } from '../scenes/world/house-cinema-scene.js';

export const gameConfig: Types.Core.GameConfig = {
  type: AUTO,
  width: LOGICAL_WIDTH,
  height: LOGICAL_HEIGHT,
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [
    BootScene,
    TitleScene,
    HUDScene,
    KholiInteriorScene,
    NeighborhoodScene,
    HouseBollywoodScene,
    HouseMusicScene,
    HouseTextileScene,
    HouseFitnessScene,
    HouseFoodScene,
    HouseCinemaScene,
  ],
};
