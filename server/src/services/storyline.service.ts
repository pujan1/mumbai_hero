import { STORYLINES } from '@mumbai-hero/shared';
import type { StorylineId } from '@mumbai-hero/shared';

export function getStoryline(id: StorylineId) {
  return STORYLINES.find((s) => s.id === id) ?? null;
}

export function isValidStorylineId(id: string): id is StorylineId {
  return STORYLINES.some((s) => s.id === id);
}
