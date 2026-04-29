import Phaser from 'phaser';
import type { DialogueNode } from '@mumbai-hero/shared';
import { LOGICAL_WIDTH, LAYOUT } from '../config/constants.js';
import { advanceDialogue, selectChoice } from '../systems/dialogue-system.js';

export class DialogueBox extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private speakerText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private choiceTexts: Phaser.GameObjects.Text[] = [];
  private continueIndicator: Phaser.GameObjects.Triangle;
  private selectedChoice = 0;
  private hasChoices = false;

  constructor(scene: Phaser.Scene, y: number) {
    super(scene, 0, y);

    const w = LOGICAL_WIDTH;
    const h = LAYOUT.DIALOGUE_HEIGHT;

    this.bg = scene.add.rectangle(w / 2, h / 2, w, h, 0x1a120b, 0.92);
    this.bg.setStrokeStyle(4, 0xc8a96e);

    this.speakerText = scene.add.text(20, 12, '', {
      fontSize: '38px',
      fontFamily: 'monospace',
      color: '#f5c842',
      fontStyle: 'bold',
    });

    this.bodyText = scene.add.text(20, 60, '', {
      fontSize: '32px',
      fontFamily: 'monospace',
      color: '#f0e6cc',
      wordWrap: { width: w - 40 },
    });

    // ▼ indicator — sized to match the larger text
    this.continueIndicator = scene.add.triangle(w - 24, h - 14, 0, 0, 36, 0, 18, 24, 0xf5c842);

    this.add([this.bg, this.speakerText, this.bodyText, this.continueIndicator]);
    scene.add.existing(this);
    this.setVisible(false);
    this.setScrollFactor(0);
    this.setDepth(10);
  }

  showNode(node: DialogueNode, lineIndex: number): void {
    const line = node.lines[lineIndex];
    if (!line) return;
    this.speakerText.setText(line.speaker);
    this.bodyText.setText(line.text);
    this.clearChoices();
    this.hasChoices = false;
    this.continueIndicator.setVisible(true);
    this.setVisible(true);
  }

  showChoices(choices: { text: string; next: string }[]): void {
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
  }

  navigateChoice(dir: 1 | -1): void {
    if (!this.hasChoices) return;
    this.choiceTexts[this.selectedChoice]?.setColor('#f0e6cc');
    this.selectedChoice = Phaser.Math.Wrap(
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
    this.clearChoices();
    this.setVisible(false);
    this.hasChoices = false;
  }

  private clearChoices(): void {
    this.choiceTexts.forEach((t) => t.destroy());
    this.choiceTexts = [];
  }
}
