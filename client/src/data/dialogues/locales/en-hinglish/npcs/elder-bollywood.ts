import type { DialogueTree } from '@mumbai-hero/shared';

export const elderBollywoodDialogue: DialogueTree = {
  id: 'elder-bollywood',
  startNode: 'intro',
  nodes: [
    {
      id: 'intro',
      lines: [
        { speaker: 'Ramesh Ji', text: 'Arre aaiye aaiye! Aapki aankhon mein ek alag hi chamak hai, yaar.' },
        { speaker: 'Ramesh Ji', text: 'Main is industry mein chalees saal se hoon. Stars ko bilkul zero se sky tak jaate dekha hai.' },
        { speaker: 'Ramesh Ji', text: 'Mumbai ko nahi pata tum kahan se aaye — sirf yeh jaanna chahti hai ki kahan jaana chahte ho.' },
        { speaker: 'Ramesh Ji', text: 'Bollywood ka rasta aasaan nahi hai. Lekin sahi insaan ke liye? Yeh hi sab kuch hai.' },
      ],
      next: 'offer',
    },
    {
      id: 'offer',
      lines: [
        { speaker: 'Ramesh Ji', text: 'Main guide kar sakta hoon tumhe. Shuru karo chote se — flyers baanto, background mein kaam karo. Har legend ne kahin na kahin se start kiya tha.' },
        { speaker: 'Ramesh Ji', text: 'Chaloge mere saath is safar pe?' },
      ],
      choices: [
        { text: 'Haan ji, main Bollywood star banna chahta/chahti hoon!', next: 'accept' },
        { text: 'Abhi nahi, shukriya.', next: 'decline' },
      ],
    },
    {
      id: 'accept',
      lines: [
        { speaker: 'Ramesh Ji', text: 'Shandaar! Ekdum zabardast! Kabhi regret nahi karoge, mere dost.' },
        { speaker: 'Ramesh Ji', text: 'Jab tayaar ho wapas aao. Yeh sheher tumhara intezaar kar raha hai.' },
      ],
      onComplete: 'accept-bollywood',
    },
    {
      id: 'decline',
      lines: [
        { speaker: 'Ramesh Ji', text: 'Koi jaldi nahi, koi baat nahi. Darwaza hamesha khula hai.' },
        { speaker: 'Ramesh Ji', text: 'Jab tayaar ho, tum jaante ho kahan milna hai mujhe.' },
      ],
      onComplete: 'decline-bollywood',
    },
  ],
};
