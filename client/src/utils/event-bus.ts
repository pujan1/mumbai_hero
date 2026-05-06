import type {
  DialogueChoice,
  DialogueNode,
  GameEvent,
  ProgressionState,
} from '@mumbai-hero/shared';
import type { ContextHint } from '../scenes/base-world-scene.js';
import type { InputAction } from '../systems/input-manager.js';
import type { ShopRequest } from '../ui/shop-overlay.js';

type ShopInputAction = Exclude<InputAction, 'start' | 'inventory'>;
type Listener<TArgs extends unknown[]> = (...args: TArgs) => void;

interface EventMap {
  'backpack:toggle': [];
  'context:hint': [ContextHint];
  'dialogue:advance-requested': [];
  'dialogue:choices': [DialogueChoice[]];
  'dialogue:hide': [];
  'dialogue:panel:hide': [];
  'dialogue:panel:show': [DialogueNode, number];
  'dialogue:show': [DialogueNode, number];
  'hud:refresh': [];
  'inventory:changed': [];
  'shop:input': [ShopInputAction];
  'shop:open': [ShopRequest];
  'state:updated': [ProgressionState, GameEvent[]];
}

class EventBus {
  private listeners: { [K in keyof EventMap]: Set<Listener<EventMap[K]>> } = {
    'backpack:toggle': new Set(),
    'context:hint': new Set(),
    'dialogue:advance-requested': new Set(),
    'dialogue:choices': new Set(),
    'dialogue:hide': new Set(),
    'dialogue:panel:hide': new Set(),
    'dialogue:panel:show': new Set(),
    'dialogue:show': new Set(),
    'hud:refresh': new Set(),
    'inventory:changed': new Set(),
    'shop:input': new Set(),
    'shop:open': new Set(),
    'state:updated': new Set(),
  };

  on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): () => void {
    this.listeners[event].add(listener);
    return () => this.off(event, listener);
  }

  off<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): void {
    this.listeners[event]?.delete(listener);
  }

  emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]): void {
    this.listeners[event]?.forEach((listener) => listener(...args));
  }

  once<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): void {
    const unsub = this.on(event, (...args) => {
      listener(...args);
      unsub();
    });
  }
}

export const eventBus = new EventBus();
