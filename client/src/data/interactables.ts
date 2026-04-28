export interface InteractableDefinition {
  id: string;
  label: string;
  dialogueTreeId: string;
  transitionTarget?: { sceneId: string; spawnPoint?: string };
}

export const KHOLI_INTERACTABLES: InteractableDefinition[] = [
  { id: 'kholi-bed', label: 'Bed', dialogueTreeId: 'kholi-bed' },
  { id: 'kholi-stove', label: 'Stove', dialogueTreeId: 'kholi-stove' },
  { id: 'kholi-mirror', label: 'Mirror', dialogueTreeId: 'kholi-mirror' },
  { id: 'kholi-photo', label: 'Family Photo', dialogueTreeId: 'kholi-photo' },
  {
    id: 'kholi-door',
    label: 'Door',
    dialogueTreeId: 'kholi-door',
    transitionTarget: { sceneId: 'neighborhood-scene', spawnPoint: 'kholi-door' },
  },
];

export const NEIGHBORHOOD_CLOSED_BUILDINGS: InteractableDefinition[] = [
  { id: 'building-shop-1', label: 'Kirana Store', dialogueTreeId: 'coming-soon' },
  { id: 'building-shop-2', label: 'Medical', dialogueTreeId: 'coming-soon' },
  { id: 'building-office-1', label: 'Office', dialogueTreeId: 'coming-soon' },
  { id: 'building-unknown-1', label: 'House', dialogueTreeId: 'locked' },
];
