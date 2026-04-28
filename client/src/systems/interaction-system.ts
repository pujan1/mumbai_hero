import type { Interactable } from '../entities/interactable.js';
import { isAdjacent } from '../utils/grid.js';
import { TILE_SIZE } from '../config/constants.js';

export class InteractionSystem {
  private interactables: Interactable[] = [];

  register(interactable: Interactable): void {
    this.interactables.push(interactable);
  }

  unregisterAll(): void {
    this.interactables = [];
  }

  getInteractableAt(worldX: number, worldY: number, facingX: number, facingY: number): Interactable | null {
    const playerTileX = Math.floor(worldX / TILE_SIZE);
    const playerTileY = Math.floor(worldY / TILE_SIZE);
    const targetTileX = playerTileX + facingX;
    const targetTileY = playerTileY + facingY;

    for (const interactable of this.interactables) {
      const itx = Math.floor(interactable.x / TILE_SIZE);
      const ity = Math.floor(interactable.y / TILE_SIZE);
      if (isAdjacent(playerTileX, playerTileY, itx, ity) &&
          itx === targetTileX && ity === targetTileY) {
        return interactable;
      }
    }
    return null;
  }
}
