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
    tileX: 20,
    tileY: 2,
    stubDialogue: 'Trains to other parts of Mumbai coming soon!',
  },
  {
    id: 'bus-stop',
    label: 'BEST Bus Stop',
    sceneId: 'neighborhood-scene',
    tileX: 3,
    tileY: 2,
    stubDialogue: 'Bus routes across the city coming soon!',
  },
];

export function getFastTravelNodes(): FastTravelNode[] {
  return nodes;
}

export function getNodeById(id: string): FastTravelNode | null {
  return nodes.find((n) => n.id === id) ?? null;
}
