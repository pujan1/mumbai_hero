import { fastTravelStubs } from '../data/dialogues/index.js';

export interface FastTravelNode {
  id: string;
  label: string;
  sceneId: string;
  tileX: number;
  tileY: number;
  stubDialogue: string;
}

const nodes: FastTravelNode[] = [
  {
    id: 'train-station',
    label: 'Local Train Station',
    sceneId: 'neighborhood-scene',
    // Road H1, south lane — directly in front of the A1 station building
    tileX: 3,
    tileY: 6,
    stubDialogue: fastTravelStubs['train-station']!,
  },
  {
    id: 'bus-stop',
    label: 'BEST Bus Stop',
    sceneId: 'neighborhood-scene',
    // Road H1, south lane — near the B1 block
    tileX: 13,
    tileY: 6,
    stubDialogue: fastTravelStubs['bus-stop']!,
  },
];

export function getFastTravelNodes(): FastTravelNode[] {
  return nodes;
}

export function getNodeById(id: string): FastTravelNode | null {
  const node = nodes.find((entry) => entry.id === id);
  if (!node) return null;
  return node;
}
