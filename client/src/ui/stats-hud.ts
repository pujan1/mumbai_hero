import Phaser from 'phaser';
import { LOGICAL_WIDTH, LAYOUT } from '../config/constants.js';
import { clientGameState } from '../state/game-state.js';
import { getActiveStoryline, getStorylineTitle } from '../systems/story-progression-manager.js';

export class StatsHUD extends Phaser.GameObjects.Container {
  private nameTxt: Phaser.GameObjects.Text;
  private storylineTxt: Phaser.GameObjects.Text;
  private moneyTxt: Phaser.GameObjects.Text;
  private offlineBanner: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    const w = LOGICAL_WIDTH;
    const h = LAYOUT.HUD_HEIGHT;

    const bg = scene.add.rectangle(w / 2, h / 2, w, h, 0x0d0d1a, 0.95);
    bg.setStrokeStyle(1, 0x3a3a6a);

    this.nameTxt = scene.add.text(16, 14, 'Hero', {
      fontSize: '42px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
    });

    this.storylineTxt = scene.add.text(16, 68, 'No path chosen', {
      fontSize: '30px', fontFamily: 'monospace', color: '#aaaacc',
    });

    this.moneyTxt = scene.add.text(w - 16, 14, '₹0', {
      fontSize: '42px', fontFamily: 'monospace', color: '#f5c842', align: 'right',
    }).setOrigin(1, 0);

    this.offlineBanner = scene.add.text(w / 2, h - 12, 'Reconnecting…', {
      fontSize: '28px', fontFamily: 'monospace', color: '#ff6b6b', align: 'center',
    }).setOrigin(0.5, 1).setVisible(false);

    this.add([bg, this.nameTxt, this.storylineTxt, this.moneyTxt, this.offlineBanner]);
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(10);
  }

  refresh(): void {
    const p = clientGameState.progression;
    const profile = clientGameState.profile;
    if (!p || !profile) return;

    this.nameTxt.setText(profile.displayName ?? 'Hero');
    this.moneyTxt.setText(`₹${p.money}`);

    const active = getActiveStoryline();
    if (active) {
      this.storylineTxt.setText(getStorylineTitle(active));
    } else {
      this.storylineTxt.setText('No path chosen');
    }

    this.offlineBanner.setVisible(clientGameState.isOffline);
  }
}
