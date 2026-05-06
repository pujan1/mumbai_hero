import type { DialogueTree } from '@mumbai-hero/shared';

export const comingSoonDialogue: DialogueTree = {
  id: 'coming-soon',
  startNode: 'start',
  nodes: [{ id: 'start', lines: [{ speaker: '', text: 'Yeh jagah jald hi khulegi! Abhi ke liye thoda wait karo.' }] }],
};

export const lockedDialogue: DialogueTree = {
  id: 'locked',
  startNode: 'start',
  nodes: [{ id: 'start', lines: [{ speaker: '', text: 'Darwaza band hai.' }] }],
};

export const ambientDialogues: Record<string, DialogueTree> = {
  'ambient-chai': {
    id: 'ambient-chai',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Chai Wallah', text: 'Chai? Cutting? Aaj special hai ekdum — sirf paanch rupaye mein!' }] }],
  },
  'ambient-cricket': {
    id: 'ambient-cricket',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Cricket Kid', text: 'Bhaiya/Didi, kheloge? Mujhe ek aur fielder chahiye yaar!' }] }],
  },
  'ambient-laundry': {
    id: 'ambient-laundry',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Laundry Aunty', text: 'Arre, tumhara chehra dekh ke lag raha hai — ghar ka khana chahiye tumhe pakka.' }] }],
  },
  'ambient-vendor': {
    id: 'ambient-vendor',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: 'Vegetable Vendor', text: 'Taaze tamatar, bees rupaye kilo! Is poore mohalle mein sabse sasta!' }] }],
  },
  'ambient-dog': {
    id: 'ambient-dog',
    startNode: 'start',
    nodes: [{ id: 'start', lines: [{ speaker: '', text: 'Kutta apni pooch hilata hai aur tumhara haath sunghta hai. Yaar nikla yeh toh.' }] }],
  },
};
