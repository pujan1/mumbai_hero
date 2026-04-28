import { v4 as uuidv4 } from 'uuid';
import type { GameEvent } from '@mumbai-hero/shared';

export function createEvent(type: string, payload: Record<string, unknown>): GameEvent {
  return {
    id: uuidv4(),
    type,
    payload,
    timestamp: new Date().toISOString(),
  };
}
