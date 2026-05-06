import { GameObjects, Scene } from 'phaser';

export interface InteractableConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  onInteract: () => void;
  autoTrigger?: boolean;
}

export class Interactable extends GameObjects.Zone {
  readonly interactableId: string;
  readonly label: string;
  readonly onInteract: () => void;
  readonly autoTrigger: boolean;

  constructor(scene: Scene, config: InteractableConfig) {
    super(scene, config.x, config.y, config.width ?? 32, config.height ?? 32);
    this.interactableId = config.id;
    this.label = config.label;
    this.onInteract = config.onInteract;
    this.autoTrigger = config.autoTrigger ?? false;
    scene.add.existing(this);
  }
}
