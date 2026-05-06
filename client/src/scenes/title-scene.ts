import { GameObjects, Scene } from 'phaser';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../config/constants.js';
import { createPlayer } from '../services/state-sync.js';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';

type CharChoice = 'boy' | 'girl';

export class TitleScene extends Scene {
  private selected: CharChoice = 'boy';
  private boyLabel!: GameObjects.Text;
  private girlLabel!: GameObjects.Text;
  private statusText!: GameObjects.Text;

  constructor() {
    super({ key: 'title-scene' });
  }

  create(): void {
    const cx = LOGICAL_WIDTH / 2;
    const SPRITE_SCALE = 3.0;
    const SPRITE_HALF = (100 * SPRITE_SCALE) / 2; // 150px

    this.add.rectangle(cx, LOGICAL_HEIGHT / 2, LOGICAL_WIDTH, LOGICAL_HEIGHT, 0x0d0d2a);

    this.add.text(cx, 160, 'MUMBAI HERO', {
      fontSize: '100px', fontFamily: 'monospace', color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, 310, 'Your story begins here.', {
      fontSize: '36px', fontFamily: 'monospace', color: '#aaaacc',
    }).setOrigin(0.5);

    this.add.text(cx, 460, 'Choose your character', {
      fontSize: '42px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    // Boy — upper slot
    const boyY = 650;
    const boySprite = this.add.sprite(cx, boyY, 'player-boy', 0).setScale(SPRITE_SCALE);
    this.boyLabel = this.add.text(cx, boyY + SPRITE_HALF + 30, 'BOY', {
      fontSize: '44px', fontFamily: 'monospace', color: '#f5c842',
    }).setOrigin(0.5);

    // Girl — lower slot
    const girlY = 1100;
    const girlSprite = this.add.sprite(cx, girlY, 'player-girl', 0).setScale(SPRITE_SCALE);
    this.girlLabel = this.add.text(cx, girlY + SPRITE_HALF + 30, 'GIRL', {
      fontSize: '44px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5);

    this.add.text(cx, 1440, '↑ ↓ to choose   Z / Space to confirm', {
      fontSize: '32px', fontFamily: 'monospace', color: '#666688',
    }).setOrigin(0.5);

    this.statusText = this.add.text(cx, 1540, '', {
      fontSize: '32px', fontFamily: 'monospace', color: '#ff9944',
    }).setOrigin(0.5);

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-UP',    () => this.selectChar('boy'));
      this.input.keyboard.on('keydown-W',     () => this.selectChar('boy'));
      this.input.keyboard.on('keydown-DOWN',  () => this.selectChar('girl'));
      this.input.keyboard.on('keydown-S',     () => this.selectChar('girl'));
      this.input.keyboard.on('keydown-Z',     () => void this.confirm());
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
