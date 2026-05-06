import type { DialogueTree } from '@mumbai-hero/shared';

export const elderTextileDialogue: DialogueTree = {
  id: 'elder-textile',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Harishbhai', text: '*kapdaa naap rahe hain* Ek second, ek second...' },
        { speaker: 'Harishbhai', text: 'Fashion sirf kapde nahi hai, yaar. Yeh log ko samajhna hai — kya cheez unhe powerful feel karaati hai.' },
        { speaker: 'Harishbhai', text: 'Main tumhari umar mein Mangaldas Market mein gathriyan uthata tha. Aaj? Bollywood celebrities mujhe call karte hain.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Harishbhai', text: 'Textile trade seekhna hai? Kapdaa, fashion, poora business — sab kuch?' },
        { speaker: 'Harishbhai', text: 'Mehnat se shuruat hogi. Lekin rewards? Aseem hain.' },
      ],
      choices: [
        { text: 'Haan ji, sikhao mujhe textile ka kaam!', next: 'accept' },
        { text: 'Soch ke bataata/batati hoon.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Harishbhai', text: 'Achha achha! Pehle craft ki izzat seekho. Tayaar ho ke wapas aao.' },
      ],
      onComplete: 'accept-textile',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Harishbhai', text: 'Koi baat nahi. Main yahaan hi hoon. Achha kapdaa, achhe logon ki tarah — intezaar karna jaanta hai.' },
      ],
      onComplete: 'decline-textile',
    },
  ],
};
