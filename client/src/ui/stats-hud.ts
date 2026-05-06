import { GameObjects, Scene, type Time, type Tweens } from 'phaser';
import { LOGICAL_WIDTH, LAYOUT } from '../config/constants.js';
import { clientGameState } from '../state/game-state.js';
import { getActiveStoryline, getStorylineTitle } from '../systems/story-progression-manager.js';

const IDLE_FADE_DELAY = 3000;
const IDLE_FADE_ALPHA = 0.55;

export class StatsHUD extends GameObjects.Container {
  private nameTxt: GameObjects.Text;
  private storylineTxt: GameObjects.Text;
  private moneyTxt: GameObjects.Text;
  private offlineBanner: GameObjects.Text;

  private fadeTween: Tweens.Tween | null = null;
  private idleTimer: Time.TimerEvent | null = null;
  private lastMoney: number | null = null;
  private lastStorylineId: string | null = null;
  private firstRefresh = true;

  constructor(scene: Scene) {
    super(scene, 0, 0);

    const w = LOGICAL_WIDTH;
    const h = LAYOUT.HUD_HEIGHT;

    const bg = scene.add.rectangle(w / 2, h / 2, w, h, 0x0d0d1a, 0.95);
    bg.setStrokeStyle(1, 0x3a3a6a);

    this.nameTxt = scene.add.text(16, 10, 'Hero', {
      fontSize: '42px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
    });

    this.storylineTxt = scene.add.text(16, 62, 'No path chosen', {
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

    const moneyChanged = this.lastMoney !== null && this.lastMoney !== p.money;
    this.moneyTxt.setText(`₹${p.money}`);
    if (moneyChanged) this.pulse(this.moneyTxt);
    this.lastMoney = p.money;

    const active = getActiveStoryline();
    const newStorylineId = active;
    if (active) {
      this.storylineTxt.setText(getStorylineTitle(active));
    } else {
      this.storylineTxt.setText('No path chosen');
    }
    if (this.lastStorylineId !== null && this.lastStorylineId !== newStorylineId) {
      this.pulse(this.storylineTxt);
    }
    this.lastStorylineId = newStorylineId;

    this.offlineBanner.setVisible(clientGameState.isOffline);

    // Skip the initial wake-up so the bar starts in its idle state instead of
    // flashing fully bright on every fresh scene.
    if (this.firstRefresh) {
      this.firstRefresh = false;
      this.scheduleFade(0);
    } else {
      this.wakeUp();
    }
  }

  private wakeUp(): void {
    this.fadeTween?.stop();
    this.fadeTween = null;
    this.setAlpha(1);
    this.scheduleFade(IDLE_FADE_DELAY);
  }

  private scheduleFade(delay: number): void {
    this.idleTimer?.remove();
    this.idleTimer = this.scene.time.delayedCall(delay, () => {
      this.fadeTween = this.scene.tweens.add({
        targets: this,
        alpha: IDLE_FADE_ALPHA,
        duration: 600,
        ease: 'Quad.out',
      });
    });
  }

  private pulse(target: GameObjects.Text): void {
    this.scene.tweens.killTweensOf(target);
    target.setScale(1);
    this.scene.tweens.add({
      targets: target,
      scaleX: 1.18,
      scaleY: 1.18,
      duration: 120,
      yoyo: true,
      ease: 'Sine.inOut',
    });
  }
}
