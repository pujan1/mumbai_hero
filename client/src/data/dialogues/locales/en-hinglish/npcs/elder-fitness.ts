import type { DialogueTree } from '@mumbai-hero/shared';

export const elderFitnessDialogue: DialogueTree = {
  id: 'elder-fitness',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Bala Bhai', text: '*hasate hue muscles flex karte hain* Aye! Tu seedha aisa dikhta hai jise muscles nahi, guidance chahiye pehle!' },
        { speaker: 'Bala Bhai', text: 'Do saal tak gym saaf kiya maine, barbell chhoone se pehle. Yahi hai craft ki sachchi izzat.' },
        { speaker: 'Bala Bhai', text: 'Aaj? Film stars, business log — sab mere paas aate hain. Aur mere paas chaar gyms hain apne.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Bala Bhai', text: 'Fitness sirf body nahi hai — discipline hai, business hai, mindset hai. Seekhna hai yeh sab kuch?' },
      ],
      choices: [
        { text: 'Haan! Main fitness empire banana chahta/chahti hoon!', next: 'accept' },
        { text: 'Abhi mere liye nahi shayad.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Bala Bhai', text: 'Wah mere bhai/behen! Bottom se shuru karenge, upar tak jayenge. Mehnat ke liye tayaar hokar aao!' },
      ],
      onComplete: 'accept-fitness',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Bala Bhai', text: 'Koi pressure nahi! Weights yahaan hi rahenge. Jab ready ho wapas aa jaana.' },
      ],
      onComplete: 'decline-fitness',
    },
  ],
};
