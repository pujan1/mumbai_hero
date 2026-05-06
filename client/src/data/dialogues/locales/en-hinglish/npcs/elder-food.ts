import type { DialogueTree } from '@mumbai-hero/shared';

export const elderFoodDialogue: DialogueTree = {
  id: 'elder-food',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Uday Kaka', text: '*ek plate aage badhate hain* Pehle khaao, phir baat! Yeh mera rule hai hamesha se.' },
        { speaker: 'Uday Kaka', text: 'Khaana pyaar hai. Khaana sanskriti hai. Khaana business hai. Teen cheezein ek mein samet li jaati hain.' },
        { speaker: 'Uday Kaka', text: 'Main station ke paas vada pav ki rehdi lagata tha. Kabhi kabhi bees rupaye ka hi munafa. Aaj? Teen restaurants ko supply karta hoon.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Uday Kaka', text: 'Mumbai street food pe chalti hai. Lekin asli vision? Uss dil ko global banana hai.' },
        { speaker: 'Uday Kaka', text: 'Is safar pe chaloge is budhhe Kaka ke saath?' },
      ],
      choices: [
        { text: 'Haan! Main food empire banana chahta/chahti hoon!', next: 'accept' },
        { text: 'Abhi nahi, Kaka.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Uday Kaka', text: 'Wah wah! Pehla lesson: sab kuch chakhte raho. Apna product jaano andar se. Jaldi wapas aao, beta!' },
      ],
      onComplete: 'accept-food',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Uday Kaka', text: 'Koi baat nahi! Kabhi bhi aao. Chai taiyaar milegi hamesha.' },
      ],
      onComplete: 'decline-food',
    },
  ],
};
