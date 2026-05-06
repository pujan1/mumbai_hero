import { GameObjects, Geom, Math as PhaserMath, Scene, type Tweens } from 'phaser';
import type { DialogueNode, DialogueChoice } from '@mumbai-hero/shared';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT, LAYOUT } from '../config/constants.js';
import { advanceDialogue, selectChoice, forceCloseDialogue } from '../systems/dialogue-system.js';

const NPC_SPEAKER_COLOR = '#f5c842';
const NPC_BODY_COLOR = '#f0e6cc';
const PLAYER_SPEAKER_COLOR = '#6ec3f5';
const PLAYER_BODY_COLOR = '#dbeeff';

const SHOWN_Y = LOGICAL_HEIGHT - LAYOUT.DIALOGUE_HEIGHT;
const HIDDEN_Y = LOGICAL_HEIGHT + 20;
const SLIDE_DURATION = 200;

export class DialogueBox extends GameObjects.Container {
  private bg: GameObjects.Rectangle;
  private speakerText: GameObjects.Text;
  private bodyText: GameObjects.Text;
  private choiceTexts: GameObjects.Text[] = [];
  private continueIndicator: GameObjects.Triangle;
  private closeBtn: GameObjects.Text;
  private selectedChoice = 0;
  private hasChoices = false;
  private slideTween: Tweens.Tween | null = null;

  constructor(scene: Scene) {
    super(scene, 0, HIDDEN_Y);

    const w = LOGICAL_WIDTH;
    const h = LAYOUT.DIALOGUE_HEIGHT;

    this.bg = scene.add.rectangle(w / 2, h / 2, w, h, 0x1a120b, 0.92);
    this.bg.setStrokeStyle(4, 0xc8a96e);

    this.speakerText = scene.add.text(20, 12, '', {
      fontSize: '38px',
      fontFamily: 'monospace',
      color: NPC_SPEAKER_COLOR,
      fontStyle: 'bold',
    });

    this.bodyText = scene.add.text(20, 60, '', {
      fontSize: '32px',
      fontFamily: 'monospace',
      color: NPC_BODY_COLOR,
      wordWrap: { width: w - 40 },
    });

    this.continueIndicator = scene.add.triangle(w - 24, h - 14, 0, 0, 36, 0, 18, 24, 0xf5c842);
    this.continueIndicator
      .setInteractive(new Geom.Rectangle(-30, -30, 90, 60), Geom.Rectangle.Contains)
      .on('pointerdown', () => this.onAdvance());

    this.closeBtn = scene.add.text(w - 16, 10, '✕', {
      fontSize: '42px',
      fontFamily: 'monospace',
      color: '#c8a96e',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    this.closeBtn.on('pointerover',  () => this.closeBtn.setColor('#ffffff'));
    this.closeBtn.on('pointerout',   () => this.closeBtn.setColor('#c8a96e'));
    this.closeBtn.on('pointerdown',  () => forceCloseDialogue());

    this.add([this.bg, this.speakerText, this.bodyText, this.continueIndicator, this.closeBtn]);
    scene.add.existing(this);
    this.setVisible(false);
    this.setScrollFactor(0);
    this.setDepth(10);
  }

  showNode(node: DialogueNode, lineIndex: number): void {
    const line = node.lines[lineIndex];
    if (!line) return;

    if (line.isPlayer) {
      this.speakerText.setColor(PLAYER_SPEAKER_COLOR);
      this.bodyText.setColor(PLAYER_BODY_COLOR);
    } else {
      this.speakerText.setColor(NPC_SPEAKER_COLOR);
      this.bodyText.setColor(NPC_BODY_COLOR);
    }

    this.speakerText.setText(line.speaker);
    this.bodyText.setText(line.text);
    this.clearChoices();
    this.hasChoices = false;
    this.continueIndicator.setVisible(true);
    this.slideIn();
  }

  showChoices(choices: DialogueChoice[]): void {
    this.continueIndicator.setVisible(false);
    this.hasChoices = true;
    this.selectedChoice = 0;
    this.clearChoices();
    choices.forEach((c, i) => {
      const t = this.scene.add.text(20, 60 + i * 42, `▶ ${c.text}`, {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: i === 0 ? '#f5c842' : '#f0e6cc',
      });
      this.choiceTexts.push(t);
      this.add(t);
    });
    this.slideIn();
  }

  navigateChoice(dir: 1 | -1): void {
    if (!this.hasChoices) return;
    this.choiceTexts[this.selectedChoice]?.setColor('#f0e6cc');
    this.selectedChoice = PhaserMath.Wrap(
      this.selectedChoice + dir,
      0,
      this.choiceTexts.length,
    );
    this.choiceTexts[this.selectedChoice]?.setColor('#f5c842');
  }

  confirmChoice(): void {
    if (!this.hasChoices) return;
    selectChoice(this.selectedChoice);
  }

  onAdvance(): void {
    if (this.hasChoices) {
      this.confirmChoice();
    } else {
      advanceDialogue();
    }
  }

  hide(): void {
    if (!this.visible) return;
    this.slideOut();
  }

  private slideIn(): void {
    this.slideTween?.stop();
    this.setVisible(true);
    this.slideTween = this.scene.tweens.add({
      targets: this,
      y: SHOWN_Y,
      duration: SLIDE_DURATION,
      ease: 'Cubic.out',
    });
  }

  private slideOut(): void {
    this.slideTween?.stop();
    this.slideTween = this.scene.tweens.add({
      targets: this,
      y: HIDDEN_Y,
      duration: SLIDE_DURATION,
      ease: 'Cubic.in',
      onComplete: () => {
        this.clearChoices();
        this.hasChoices = false;
        this.setVisible(false);
      },
    });
  }

  private clearChoices(): void {
    this.choiceTexts.forEach((t) => t.destroy());
    this.choiceTexts = [];
  }
}
