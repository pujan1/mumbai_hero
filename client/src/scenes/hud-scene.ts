import { Scene } from 'phaser';
import { StatsHUD } from '../ui/stats-hud.js';
import { DialogueBox } from '../ui/dialogue-box.js';
import { OnScreenControls } from '../ui/on-screen-controls.js';
import { MenuOverlay } from '../ui/menu-overlay.js';
import { BackpackOverlay } from '../ui/backpack-overlay.js';
import { ShopOverlay } from '../ui/shop-overlay.js';
import { eventBus } from '../utils/event-bus.js';
import { clientGameState } from '../state/game-state.js';

export class HUDScene extends Scene {
  private statsHUD!: StatsHUD;
  private dialogueBox!: DialogueBox;
  private controls!: OnScreenControls;
  private menu!: MenuOverlay;
  private backpack!: BackpackOverlay;
  private shop!: ShopOverlay;

  constructor() {
    super({ key: 'hud-scene', active: false });
  }

  create(): void {
    this.statsHUD = new StatsHUD(this);
    this.dialogueBox = new DialogueBox(this);
    this.controls = new OnScreenControls(this);
    this.menu = new MenuOverlay(this);
    this.backpack = new BackpackOverlay(this);
    this.shop = new ShopOverlay(this);

    // The bottom panel is the fallback channel: it only renders for narration
    // (no speaker), unresolved speakers, and choice menus. Speech bubbles in
    // the world scene handle the common case via dialogue:panel:hide.
    eventBus.on('dialogue:panel:show', (node, lineIndex) => {
      this.dialogueBox.showNode(node, lineIndex);
    });

    eventBus.on('dialogue:panel:hide', () => {
      this.dialogueBox.hide();
    });

    eventBus.on('dialogue:choices', (choices) => {
      this.dialogueBox.showChoices(choices);
    });

    eventBus.on('dialogue:hide', () => {
      this.dialogueBox.hide();
    });

    eventBus.on('state:updated', (progression) => {
      clientGameState.progression = progression;
      this.statsHUD.refresh();
    });

    eventBus.on('hud:refresh', () => {
      this.statsHUD.refresh();
    });

    eventBus.on('shop:open', (req) => {
      this.shop.open(req);
    });

    eventBus.on('backpack:toggle', () => {
      this.backpack.toggle();
    });

    eventBus.on('dialogue:advance-requested', () => {
      this.dialogueBox.onAdvance();
    });

    eventBus.on('shop:input', (action) => {
      this.shop.handleInput(action);
    });

    this.statsHUD.refresh();

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ENTER', () => {
        // ENTER toggles the pause menu, but only when no other modal is open.
        if (this.backpack.isBackpackOpen() || this.shop.isShopOpen()) return;
        this.menu.toggle();
      });

      this.input.keyboard.on('keydown-I', () => {
        if (this.shop.isShopOpen()) return;
        this.backpack.toggle();
      });
    }
  }
}
