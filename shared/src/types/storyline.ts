import type { StorylineId } from './game-state.js';

export interface StorylineStage {
  stage: number;
  title: string;
  description: string;
}

export interface Storyline {
  id: StorylineId;
  name: string;
  elderName: string;
  elderNpcId: string;
  houseSceneId: string;
  stages: StorylineStage[];
}

export const STORYLINES: Storyline[] = [
  {
    id: 'bollywood',
    name: 'The Bollywood Star',
    elderName: 'Ramesh Ji',
    elderNpcId: 'elder-bollywood',
    houseSceneId: 'house-bollywood-scene',
    stages: [
      { stage: 0, title: 'Dreamer', description: 'You have not yet begun your journey.' },
      { stage: 1, title: 'Small Gig Advertiser', description: 'Handing out flyers for local events.' },
      { stage: 2, title: 'Side Actor', description: 'Background roles in small productions.' },
      { stage: 3, title: 'Ad Lead', description: 'Starring in regional advertisements.' },
      { stage: 4, title: 'TV Lead', description: 'Leading role in a popular TV serial.' },
      { stage: 5, title: 'Film Lead', description: 'Starring in major Bollywood films.' },
      { stage: 6, title: 'Iconic Superstar', description: 'A legend of Indian cinema.' },
    ],
  },
  {
    id: 'playback-singer',
    name: 'The Playback Singer',
    elderName: 'Meena Tai',
    elderNpcId: 'elder-music',
    houseSceneId: 'house-music-scene',
    stages: [
      { stage: 0, title: 'Dreamer', description: 'You have not yet begun your journey.' },
      { stage: 1, title: 'Chorus Singer', description: 'Singing backup for local recordings.' },
      { stage: 2, title: 'Cafe Performer', description: 'Performing at local cafes and events.' },
      { stage: 3, title: 'Ad Jingle Singer', description: 'Your voice is on the radio.' },
      { stage: 4, title: 'Reality TV Contestant', description: 'Competing on a national singing show.' },
      { stage: 5, title: 'Bollywood Playback Singer', description: 'Your voice behind the silver screen.' },
      { stage: 6, title: 'International Music Icon', description: 'Known across the globe.' },
    ],
  },
  {
    id: 'textile',
    name: 'The Textile Mogul',
    elderName: 'Harishbhai',
    elderNpcId: 'elder-textile',
    houseSceneId: 'house-textile-scene',
    stages: [
      { stage: 0, title: 'Dreamer', description: 'You have not yet begun your journey.' },
      { stage: 1, title: 'Mangaldas Market Porter', description: 'Carrying fabric bales at the market.' },
      { stage: 2, title: "Tailor's Apprentice", description: 'Learning the craft from a master.' },
      { stage: 3, title: 'Boutique Assistant', description: 'Working in a fashion boutique.' },
      { stage: 4, title: 'Independent Fashion Designer', description: 'Your own label, your own vision.' },
      { stage: 5, title: 'Bollywood Celebrity Stylist', description: 'Dressing the stars.' },
      { stage: 6, title: 'Global Fashion Label Owner', description: 'A name known worldwide.' },
    ],
  },
  {
    id: 'fitness',
    name: 'The Fitness Mogul',
    elderName: 'Bala Bhai',
    elderNpcId: 'elder-fitness',
    houseSceneId: 'house-fitness-scene',
    stages: [
      { stage: 0, title: 'Dreamer', description: 'You have not yet begun your journey.' },
      { stage: 1, title: 'Gym Cleaner', description: 'Starting at the bottom, learning the ropes.' },
      { stage: 2, title: 'Personal Trainer', description: 'Helping clients reach their goals.' },
      { stage: 3, title: 'Celebrity Fitness Coach', description: 'Training the famous.' },
      { stage: 4, title: 'Gym Chain Owner', description: 'Your name above the door.' },
      { stage: 5, title: 'Wellness App Founder', description: 'Fitness in every pocket.' },
      { stage: 6, title: 'Global Health & Fitness Tycoon', description: 'An empire built on sweat.' },
    ],
  },
  {
    id: 'food',
    name: 'The Food Tycoon',
    elderName: 'Uday Kaka',
    elderNpcId: 'elder-food',
    houseSceneId: 'house-food-scene',
    stages: [
      { stage: 0, title: 'Dreamer', description: 'You have not yet begun your journey.' },
      { stage: 1, title: 'Vada Pav Stall Helper', description: 'Learning the flavours of Mumbai.' },
      { stage: 2, title: 'Street Food Cart Owner', description: 'Your own stall, your own recipes.' },
      { stage: 3, title: 'Udupi Restaurant Owner', description: 'A proper sit-down eatery.' },
      { stage: 4, title: 'Local Eatery Chain Founder', description: 'Multiple locations across the city.' },
      { stage: 5, title: 'Fine-Dining Restaurateur', description: 'The finest tables in Mumbai.' },
      { stage: 6, title: 'Global Hospitality Tycoon', description: 'A culinary empire.' },
    ],
  },
  {
    id: 'cinematographer',
    name: 'The Cinematographer',
    elderName: 'Sunita Madam',
    elderNpcId: 'elder-cinema',
    houseSceneId: 'house-cinema-scene',
    stages: [
      { stage: 0, title: 'Dreamer', description: 'You have not yet begun your journey.' },
      { stage: 1, title: 'Tourist Photographer', description: 'Capturing moments at the Gateway of India.' },
      { stage: 2, title: 'Wedding Photography Assistant', description: 'Learning to capture memories.' },
      { stage: 3, title: 'Fashion Magazine Photographer', description: 'Your work in print.' },
      { stage: 4, title: 'Assistant Cinematographer', description: 'On set with the pros.' },
      { stage: 5, title: 'Lead Director of Photography', description: 'You control the frame.' },
      { stage: 6, title: 'Oscar-Winning Cinematographer', description: 'The world sees through your lens.' },
    ],
  },
];
