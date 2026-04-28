import Phaser from 'phaser';

export interface InteractableConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  onInteract: () => void;
}

export class Interactable extends Phaser.GameObjects.Zone {
  readonly interactableId: string;
  readonly label: string;
  readonly onInteract: () => void;

  constructor(scene: Phaser.Scene, config: InteractableConfig) {
    super(scene, config.x, config.y, config.width ?? 32, config.height ?? 32);
    this.interactableId = config.id;
    this.label = config.label;
    this.onInteract = config.onInteract;
    scene.add.existing(this);
  }
}
