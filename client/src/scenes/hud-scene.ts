import Phaser from 'phaser';
import { StatsHUD } from '../ui/stats-hud.js';
import { DialogueBox } from '../ui/dialogue-box.js';
import { OnScreenControls } from '../ui/on-screen-controls.js';
import { MenuOverlay } from '../ui/menu-overlay.js';
import { LAYOUT } from '../config/constants.js';
import { eventBus } from '../utils/event-bus.js';
import type { DialogueNode } from '@mumbai-hero/shared';
import { clientGameState } from '../state/game-state.js';
import type { ProgressionState } from '@mumbai-hero/shared';

export class HUDScene extends Phaser.Scene {
  private statsHUD!: StatsHUD;
  private dialogueBox!: DialogueBox;
  private controls!: OnScreenControls;
  private menu!: MenuOverlay;

  constructor() {
    super({ key: 'hud-scene', active: false });
  }

  create(): void {
    this.statsHUD = new StatsHUD(this);
    this.dialogueBox = new DialogueBox(this, LAYOUT.HUD_HEIGHT);
    this.controls = new OnScreenControls(this);
    this.menu = new MenuOverlay(this);

    eventBus.on('dialogue:show', (node: unknown, lineIndex: unknown) => {
      this.dialogueBox.showNode(node as DialogueNode, lineIndex as number);
    });

    eventBus.on('dialogue:choices', (choices: unknown) => {
      this.dialogueBox.showChoices(choices as { text: string; next: string }[]);
    });

    eventBus.on('dialogue:hide', () => {
      this.dialogueBox.hide();
    });

    eventBus.on('state:updated', (progression: unknown) => {
      clientGameState.progression = progression as ProgressionState;
      this.statsHUD.refresh();
    });

    eventBus.on('hud:refresh', () => {
      this.statsHUD.refresh();
    });

    this.statsHUD.refresh();

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ENTER', () => {
        this.menu.toggle();
      });
    }
  }

  getDialogueBox(): DialogueBox {
    return this.dialogueBox;
  }
}
