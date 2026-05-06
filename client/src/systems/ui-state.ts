// Tracks which blocking overlay (if any) currently owns input. World scenes
// check this in their update loop to decide whether to read movement/action
// keys. Overlays set themselves as active when they open.

export type ActiveOverlay = 'backpack' | 'shop' | null;

let active: ActiveOverlay = null;

export function setActiveOverlay(o: ActiveOverlay): void {
  active = o;
}

export function getActiveOverlay(): ActiveOverlay {
  return active;
}

export function isOverlayBlocking(): boolean {
  return active !== null;
}
