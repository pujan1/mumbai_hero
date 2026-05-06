import { Input, Scene, type Types } from 'phaser';

export type InputAction = 'up' | 'down' | 'left' | 'right' | 'action' | 'cancel' | 'start' | 'inventory';
type DirectionAction = 'up' | 'down' | 'left' | 'right';
type KeyboardKey = Input.Keyboard.Key;

const touchState: Record<InputAction, boolean> = {
  up: false, down: false, left: false, right: false,
  action: false, cancel: false, start: false, inventory: false,
};

let cursors: Types.Input.Keyboard.CursorKeys | null = null;
let wasd: Record<DirectionAction, KeyboardKey> | null = null;
let actionKey: KeyboardKey | null = null;
let cancelKey: KeyboardKey | null = null;
let startKey: KeyboardKey | null = null;
let spaceKey: KeyboardKey | null = null;
let shiftKey: KeyboardKey | null = null;
let inventoryKey: KeyboardKey | null = null;

export function initInputManager(scene: Scene): void {
  if (!scene.input.keyboard) return;
  cursors = scene.input.keyboard.createCursorKeys();
  wasd = {
    up: scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.W),
    down: scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.S),
    left: scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A),
    right: scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D),
  };
  actionKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.Z);
  spaceKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
  cancelKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.X);
  shiftKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SHIFT);
  startKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.ENTER);
  inventoryKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.I);
}

export function isDown(action: InputAction): boolean {
  if (touchState[action]) return true;
  if (!cursors) return false;
  switch (action) {
    case 'up': return cursors.up.isDown || isKeyboardDown(wasdKey('up'));
    case 'down': return cursors.down.isDown || isKeyboardDown(wasdKey('down'));
    case 'left': return cursors.left.isDown || isKeyboardDown(wasdKey('left'));
    case 'right': return cursors.right.isDown || isKeyboardDown(wasdKey('right'));
    case 'action': return isKeyboardDown(actionKey) || isKeyboardDown(spaceKey) || isKeyboardDown(shiftKey);
    case 'cancel': return isKeyboardDown(cancelKey) || isKeyboardDown(startKey);
    case 'start': return isKeyboardDown(startKey);
    case 'inventory': return isKeyboardDown(inventoryKey);
    default: return false;
  }
}

export function justPressed(action: InputAction): boolean {
  if (!cursors) return false;
  switch (action) {
    case 'up': return Input.Keyboard.JustDown(cursors.up) || justPressedKey(wasdKey('up'));
    case 'down': return Input.Keyboard.JustDown(cursors.down) || justPressedKey(wasdKey('down'));
    case 'left': return Input.Keyboard.JustDown(cursors.left) || justPressedKey(wasdKey('left'));
    case 'right': return Input.Keyboard.JustDown(cursors.right) || justPressedKey(wasdKey('right'));
    case 'action': return justPressedKey(actionKey) || justPressedKey(spaceKey) || justPressedKey(shiftKey);
    case 'cancel': return justPressedKey(cancelKey) || justPressedKey(startKey);
    case 'start': return justPressedKey(startKey);
    case 'inventory': return justPressedKey(inventoryKey);
    default: return false;
  }
}

export function setTouchState(action: InputAction, pressed: boolean): void {
  touchState[action] = pressed;
}

function isKeyboardDown(key: KeyboardKey | null | undefined): boolean {
  if (!key) return false;
  return key.isDown;
}

function justPressedKey(key: KeyboardKey | null | undefined): boolean {
  if (!key) return false;
  return Input.Keyboard.JustDown(key);
}

function wasdKey(action: DirectionAction): KeyboardKey | null {
  if (!wasd) return null;
  return wasd[action];
}
