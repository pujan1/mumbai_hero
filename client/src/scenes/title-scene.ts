import Phaser from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../config/constants.js';
import { createPlayer } from '../services/state-sync.js';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';

type CharChoice = 'boy' | 'girl';

export class TitleScene extends Phaser.Scene {
  private selected: CharChoice = 'boy';
  private boyLabel!: Phaser.GameObjects.Text;
  private girlLabel!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'title-scene' });
  }

  create(): void {
    const cx = LOGICAL_WIDTH / 2;

    this.add.rectangle(cx, LOGICAL_HEIGHT / 2, LOGICAL_WIDTH, LOGICAL_HEIGHT, 0x0d0d2a);

    this.add.text(cx, 80, 'MUMBAI HERO', {
      fontSize: '28px', fontFamily: 'monospace', color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, 120, 'Your story begins here.', {
      fontSize: '11px', fontFamily: 'monospace', color: '#aaaacc',
    }).setOrigin(0.5);

    this.add.text(cx, 220, 'Choose your character', {
      fontSize: '13px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    const boySprite = this.add.image(cx - 60, 300, 'player-boy').setScale(2);
    const girlSprite = this.add.image(cx + 60, 300, 'player-girl').setScale(2);
    void boySprite; void girlSprite;

    this.boyLabel = this.add.text(cx - 60, 330, 'BOY', {
      fontSize: '11px', fontFamily: 'monospace', color: '#f5c842',
    }).setOrigin(0.5);

    this.girlLabel = this.add.text(cx + 60, 330, 'GIRL', {
      fontSize: '11px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5);

    this.add.text(cx, 380, '← → to choose   Z/Space to confirm', {
      fontSize: '9px', fontFamily: 'monospace', color: '#666688',
    }).setOrigin(0.5);

    this.statusText = this.add.text(cx, 420, '', {
      fontSize: '10px', fontFamily: 'monospace', color: '#ff9944',
    }).setOrigin(0.5);

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-LEFT', () => this.selectChar('boy'));
      this.input.keyboard.on('keydown-A', () => this.selectChar('boy'));
      this.input.keyboard.on('keydown-RIGHT', () => this.selectChar('girl'));
      this.input.keyboard.on('keydown-D', () => this.selectChar('girl'));
      this.input.keyboard.on('keydown-Z', () => void this.confirm());
      this.input.keyboard.on('keydown-SPACE', () => void this.confirm());
      this.input.keyboard.on('keydown-ENTER', () => void this.confirm());
    }

    boySprite.setInteractive().on('pointerdown', () => {
      this.selectChar('boy');
      void this.confirm();
    });
    girlSprite.setInteractive().on('pointerdown', () => {
      this.selectChar('girl');
      void this.confirm();
    });
  }

  private selectChar(choice: CharChoice): void {
    this.selected = choice;
    this.boyLabel.setColor(choice === 'boy' ? '#f5c842' : '#888888');
    this.girlLabel.setColor(choice === 'girl' ? '#f5c842' : '#888888');
  }

  private async confirm(): Promise<void> {
    this.statusText.setText('Creating hero…');
    try {
      const state = await createPlayer(this.selected);
      clientGameState.profile = state.profile;
      clientGameState.progression = state.progression;
      clientGameState.isOffline = false;
      clientGameState.isLoaded = true;
      eventBus.emit('state:updated', state.progression, []);
      this.scene.launch('hud-scene');
      this.scene.start('kholi-interior-scene');
    } catch (err) {
      this.statusText.setText('Could not reach server. Try again.');
      console.error(err);
    }
  }
}
