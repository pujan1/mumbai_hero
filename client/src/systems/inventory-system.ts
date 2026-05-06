import type { InventoryItem, ProgressionState } from '@mumbai-hero/shared';
import { DEFAULT_BACKPACK_CAPACITY } from '@mumbai-hero/shared';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';
import { ITEMS, BACKPACK_UPGRADES, getItem } from '../data/items.js';

// Generic inventory operations — usable for player, shopkeepers, vendors,
// elders, anyone holding items. Capacity is the number of stacks (slots).
// A slot holds up to ITEMS[itemId].stackSize of one item; trying to add more
// rolls over to a new slot. Shopkeeper inventories use a large capacity.

export interface InventoryHolder {
  inventory: InventoryItem[];
  capacity: number;
}

export function usedSlots(items: InventoryItem[]): number {
  // One slot per InventoryItem entry. We split overflow into new entries.
  return items.length;
}

export function freeSlots(holder: InventoryHolder): number {
  return Math.max(0, holder.capacity - usedSlots(holder.inventory));
}

export function countOf(items: InventoryItem[], itemId: string): number {
  return items
    .filter((i) => i.itemId === itemId)
    .reduce((sum, i) => sum + i.quantity, 0);
}

// Adds `qty` of `itemId` into the holder's inventory, packing into existing
// non-full stacks first, then filling free slots. Returns the number that
// could not fit (0 on full success).
export function addItem(holder: InventoryHolder, itemId: string, qty: number): number {
  const def = getItem(itemId);
  if (!def || qty <= 0) return qty;
  let remaining = qty;

  for (const slot of holder.inventory) {
    if (remaining === 0) break;
    if (slot.itemId !== itemId) continue;
    const room = def.stackSize - slot.quantity;
    if (room <= 0) continue;
    const take = Math.min(room, remaining);
    slot.quantity += take;
    remaining -= take;
  }

  while (remaining > 0 && usedSlots(holder.inventory) < holder.capacity) {
    const take = Math.min(def.stackSize, remaining);
    holder.inventory.push({ itemId, quantity: take });
    remaining -= take;
  }

  return remaining;
}

// Removes `qty` of `itemId`. Returns true if the full quantity was removed.
export function removeItem(holder: InventoryHolder, itemId: string, qty: number): boolean {
  if (countOf(holder.inventory, itemId) < qty) return false;
  let remaining = qty;
  for (let i = holder.inventory.length - 1; i >= 0 && remaining > 0; i--) {
    const slot = holder.inventory[i]!;
    if (slot.itemId !== itemId) continue;
    const take = Math.min(slot.quantity, remaining);
    slot.quantity -= take;
    remaining -= take;
    if (slot.quantity === 0) holder.inventory.splice(i, 1);
  }
  return true;
}

// ── Player-specific glue ────────────────────────────────────────────────────
// The player's inventory lives on ProgressionState (synced to server). These
// helpers wrap the generic ops and emit a HUD refresh event.

function progression(): ProgressionState | null {
  return clientGameState.progression;
}

export function getPlayerHolder(): InventoryHolder | null {
  const p = progression();
  if (!p) return null;
  return {
    inventory: p.inventory,
    capacity: p.backpackCapacity ?? DEFAULT_BACKPACK_CAPACITY,
  };
}

export function playerHas(itemId: string, qty = 1): boolean {
  const p = progression();
  if (!p) return false;
  return countOf(p.inventory, itemId) >= qty;
}

export function playerAdd(itemId: string, qty: number): number {
  const holder = getPlayerHolder();
  if (!holder) return qty;
  const leftover = addItem(holder, itemId, qty);
  eventBus.emit('hud:refresh');
  eventBus.emit('inventory:changed');
  return leftover;
}

export function playerRemove(itemId: string, qty: number): boolean {
  const holder = getPlayerHolder();
  if (!holder) return false;
  const ok = removeItem(holder, itemId, qty);
  if (ok) {
    eventBus.emit('hud:refresh');
    eventBus.emit('inventory:changed');
  }
  return ok;
}

export function adjustPlayerMoney(delta: number): boolean {
  const p = progression();
  if (!p) return false;
  if (p.money + delta < 0) return false;
  p.money += delta;
  eventBus.emit('hud:refresh');
  return true;
}

export function setPlayerBackpackCapacity(capacity: number): void {
  const p = progression();
  if (!p) return;
  p.backpackCapacity = capacity;
  eventBus.emit('hud:refresh');
  eventBus.emit('inventory:changed');
}

// ── Trade ───────────────────────────────────────────────────────────────────
// `merchant` is any holder (vendor, shopkeeper, elder…). Trades go in either
// direction; the player can buy from or sell to whoever has the item.

export interface TradeResult {
  ok: boolean;
  reason?: 'no-stock' | 'no-money' | 'no-space' | 'merchant-full' | 'no-item';
}

export function buyFromMerchant(merchant: InventoryHolder, itemId: string, qty: number): TradeResult {
  const def = getItem(itemId);
  if (!def) return { ok: false, reason: 'no-item' };
  if (countOf(merchant.inventory, itemId) < qty) return { ok: false, reason: 'no-stock' };

  const cost = def.buyPrice * qty;
  const p = progression();
  if (!p) return { ok: false, reason: 'no-money' };
  if (p.money < cost) return { ok: false, reason: 'no-money' };

  const player = getPlayerHolder();
  if (!player) return { ok: false, reason: 'no-space' };

  // Special-case: backpack upgrades expand capacity rather than fill a slot.
  if (BACKPACK_UPGRADES[itemId] !== undefined) {
    p.money -= cost;
    removeItem(merchant, itemId, qty);
    setPlayerBackpackCapacity(BACKPACK_UPGRADES[itemId]!);
    eventBus.emit('hud:refresh');
    return { ok: true };
  }

  // Dry-run: would the items actually fit?
  const trial = { inventory: structuredClone(player.inventory), capacity: player.capacity };
  if (addItem(trial, itemId, qty) > 0) return { ok: false, reason: 'no-space' };

  p.money -= cost;
  removeItem(merchant, itemId, qty);
  addItem(player, itemId, qty);
  eventBus.emit('hud:refresh');
  eventBus.emit('inventory:changed');
  return { ok: true };
}

export function sellToMerchant(merchant: InventoryHolder, itemId: string, qty: number): TradeResult {
  const def = getItem(itemId);
  if (!def) return { ok: false, reason: 'no-item' };
  const player = getPlayerHolder();
  if (!player) return { ok: false, reason: 'no-stock' };
  if (countOf(player.inventory, itemId) < qty) return { ok: false, reason: 'no-stock' };

  const trial = { inventory: structuredClone(merchant.inventory), capacity: merchant.capacity };
  if (addItem(trial, itemId, qty) > 0) return { ok: false, reason: 'merchant-full' };

  removeItem(player, itemId, qty);
  addItem(merchant, itemId, qty);
  const p = progression()!;
  p.money += def.sellPrice * qty;
  eventBus.emit('hud:refresh');
  eventBus.emit('inventory:changed');
  return { ok: true };
}

// Re-export so UI layers don't need to reach into ../data/items.
export { ITEMS, getItem };
