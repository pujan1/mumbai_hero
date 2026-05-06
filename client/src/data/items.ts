// Static item registry. Anyone (player, shopkeeper, vendor, NPC) refers to
// items by `itemId`; quantities live on each holder's InventoryItem[].

export type ItemCategory = 'food' | 'household' | 'consumable' | 'special';

export interface ItemDef {
  id: string;
  name: string;
  category: ItemCategory;
  // Base price (₹) when buying from a shop.
  buyPrice: number;
  // What the player gets when selling back. Usually < buyPrice.
  sellPrice: number;
  // Stack limit per inventory slot (1 slot in the 25-slot backpack).
  stackSize: number;
  // Tiny coloured icon used by the placeholder UI until real sprites land.
  iconColor: number;
  description: string;
}

export const ITEMS: Record<string, ItemDef> = {
  tomato: {
    id: 'tomato', name: 'Tomato', category: 'food',
    buyPrice: 8, sellPrice: 4, stackSize: 20,
    iconColor: 0xd83a3a,
    description: 'Fresh red tomato from the vendor.',
  },
  onion: {
    id: 'onion', name: 'Onion', category: 'food',
    buyPrice: 6, sellPrice: 3, stackSize: 20,
    iconColor: 0x9b59b6,
    description: 'A staple of every Mumbai kitchen.',
  },
  potato: {
    id: 'potato', name: 'Potato', category: 'food',
    buyPrice: 5, sellPrice: 2, stackSize: 20,
    iconColor: 0xc8a060,
    description: 'Goes with absolutely everything.',
  },
  chili: {
    id: 'chili', name: 'Green Chili', category: 'food',
    buyPrice: 4, sellPrice: 2, stackSize: 20,
    iconColor: 0x4caf50,
    description: 'Spicy. Use sparingly.',
  },
  rice: {
    id: 'rice', name: 'Rice (1kg)', category: 'food',
    buyPrice: 60, sellPrice: 30, stackSize: 10,
    iconColor: 0xfff3c2,
    description: 'A kilo of basmati.',
  },
  oil: {
    id: 'oil', name: 'Cooking Oil', category: 'household',
    buyPrice: 120, sellPrice: 60, stackSize: 5,
    iconColor: 0xf2c14e,
    description: 'For everything fried, which is everything.',
  },
  soap: {
    id: 'soap', name: 'Soap Bar', category: 'household',
    buyPrice: 25, sellPrice: 10, stackSize: 10,
    iconColor: 0xe6e6fa,
    description: 'Smells like jasmine.',
  },
  chai: {
    id: 'chai', name: 'Cup of Chai', category: 'consumable',
    buyPrice: 15, sellPrice: 6, stackSize: 5,
    iconColor: 0x8b5a2b,
    description: 'Restores a little energy.',
  },
  // Capacity upgrades that shops can sell. Effects applied by inventory-system.
  'backpack-medium': {
    id: 'backpack-medium', name: 'Medium Backpack', category: 'special',
    buyPrice: 500, sellPrice: 0, stackSize: 1,
    iconColor: 0x5a6acf,
    description: 'Expands carrying capacity to 40 slots.',
  },
  'backpack-large': {
    id: 'backpack-large', name: 'Large Backpack', category: 'special',
    buyPrice: 2000, sellPrice: 0, stackSize: 1,
    iconColor: 0x9b59b6,
    description: 'Expands carrying capacity to 60 slots.',
  },
};

// Capacity granted by special "backpack" items. Applied on buy.
export const BACKPACK_UPGRADES: Record<string, number> = {
  'backpack-medium': 40,
  'backpack-large': 60,
};

export function getItem(itemId: string): ItemDef | undefined {
  return ITEMS[itemId];
}
