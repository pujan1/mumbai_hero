import { STORYLINES } from '@mumbai-hero/shared';
import type { StorylineId } from '@mumbai-hero/shared';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';

export function getActiveStoryline(): StorylineId | null {
  const storylines = clientGameState.progression?.storylines;
  if (!storylines) return null;
  const activeStoryline = STORYLINES.find(({ id }) => storylines[id].stage > 0);
  if (!activeStoryline) return null;
  return activeStoryline.id;
}

export function getStorylineTitle(id: StorylineId): string {
  const storyline = STORYLINES.find((s) => s.id === id);
  if (!storyline) return '';
  const stage = clientGameState.progression?.storylines[id]?.stage ?? 0;
  const currentStage = storyline.stages[stage];
  if (!currentStage) return '';
  return currentStage.title;
}

export function onStateUpdated(): void {
  eventBus.emit('hud:refresh');
}
