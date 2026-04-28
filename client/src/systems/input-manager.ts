import Phaser from 'phaser';

export type InputAction = 'up' | 'down' | 'left' | 'right' | 'action' | 'cancel' | 'start';

const touchState: Record<InputAction, boolean> = {
  up: false, down: false, left: false, right: false,
  action: false, cancel: false, start: false,
};

let cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
let wasd: Record<string, Phaser.Input.Keyboard.Key> = {};
let actionKey: Phaser.Input.Keyboard.Key | null = null;
let cancelKey: Phaser.Input.Keyboard.Key | null = null;
let startKey: Phaser.Input.Keyboard.Key | null = null;
let spaceKey: Phaser.Input.Keyboard.Key | null = null;
let shiftKey: Phaser.Input.Keyboard.Key | null = null;

export function initInputManager(scene: Phaser.Scene): void {
  if (!scene.input.keyboard) return;
  cursors = scene.input.keyboard.createCursorKeys();
  wasd = {
    up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
  };
  actionKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  cancelKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  startKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
}

export function isDown(action: InputAction): boolean {
  if (touchState[action]) return true;
  if (!cursors) return false;
  switch (action) {
    case 'up': return cursors.up.isDown || (wasd['up']?.isDown ?? false);
    case 'down': return cursors.down.isDown || (wasd['down']?.isDown ?? false);
    case 'left': return cursors.left.isDown || (wasd['left']?.isDown ?? false);
    case 'right': return cursors.right.isDown || (wasd['right']?.isDown ?? false);
    case 'action': return (actionKey?.isDown ?? false) || (spaceKey?.isDown ?? false);
    case 'cancel': return (cancelKey?.isDown ?? false) || (shiftKey?.isDown ?? false);
    case 'start': return startKey?.isDown ?? false;
    default: return false;
  }
}

export function justPressed(action: InputAction): boolean {
  if (!cursors) return false;
  switch (action) {
    case 'up': return Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(wasd['up'] as Phaser.Input.Keyboard.Key);
    case 'down': return Phaser.Input.Keyboard.JustDown(cursors.down) || Phaser.Input.Keyboard.JustDown(wasd['down'] as Phaser.Input.Keyboard.Key);
    case 'left': return Phaser.Input.Keyboard.JustDown(cursors.left) || Phaser.Input.Keyboard.JustDown(wasd['left'] as Phaser.Input.Keyboard.Key);
    case 'right': return Phaser.Input.Keyboard.JustDown(cursors.right) || Phaser.Input.Keyboard.JustDown(wasd['right'] as Phaser.Input.Keyboard.Key);
    case 'action': return Phaser.Input.Keyboard.JustDown(actionKey!) || Phaser.Input.Keyboard.JustDown(spaceKey!);
    case 'cancel': return Phaser.Input.Keyboard.JustDown(cancelKey!) || Phaser.Input.Keyboard.JustDown(shiftKey!);
    case 'start': return Phaser.Input.Keyboard.JustDown(startKey!);
    default: return false;
  }
}

export function setTouchState(action: InputAction, pressed: boolean): void {
  touchState[action] = pressed;
}
