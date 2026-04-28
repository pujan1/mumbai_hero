import { STORYLINES } from '@mumbai-hero/shared';
import type { StorylineId } from '@mumbai-hero/shared';
import { clientGameState } from '../state/game-state.js';
import { eventBus } from '../utils/event-bus.js';

export function getActiveStoryline(): StorylineId | null {
  const storylines = clientGameState.progression?.storylines;
  if (!storylines) return null;
  for (const [id, progress] of Object.entries(storylines)) {
    if (progress.stage > 0) return id as StorylineId;
  }
  return null;
}

export function getStorylineTitle(id: StorylineId): string {
  const storyline = STORYLINES.find((s) => s.id === id);
  if (!storyline) return '';
  const stage = clientGameState.progression?.storylines[id]?.stage ?? 0;
  return storyline.stages[stage]?.title ?? '';
}

export function onStateUpdated(): void {
  eventBus.emit('hud:refresh');
}
