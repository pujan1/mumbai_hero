import {
  CreatePlayerResponseSchema,
  GetStateResponseSchema,
  ActionResponseSchema,
} from '@mumbai-hero/shared';
import type {
  CharacterChoice,
  ProgressionState,
  PlayerProfile,
  GameEvent,
  AcceptStorylineRequest,
  DeclineStorylineRequest,
  EnterSceneRequest,
  InteractWithObjectRequest,
  TalkToNpcRequest,
  UpdateSettingsRequest,
} from '@mumbai-hero/shared';
import { apiClient } from './api-client.js';
import { setPlayerId, setCachedState } from './local-cache.js';
import { eventBus } from '../utils/event-bus.js';

export interface SyncedState {
  profile: PlayerProfile;
  progression: ProgressionState;
}

let currentState: SyncedState | null = null;
let isOffline = false;

function applyUpdate(progression: ProgressionState, events: GameEvent[]): void {
  if (currentState) currentState.progression = progression;
  setCachedState(progression);
  eventBus.emit('state:updated', progression, events);
}

export async function createPlayer(characterChoice: CharacterChoice): Promise<SyncedState> {
  const res = await apiClient.post('/players', { characterChoice }, CreatePlayerResponseSchema);
  setPlayerId(res.playerId);
  const progression = res.state as ProgressionState;
  currentState = { profile: res.profile, progression };
  setCachedState(progression);
  return currentState!;
}

export async function loadState(): Promise<SyncedState> {
  const res = await apiClient.get('/state', GetStateResponseSchema);
  const progression = res.progression as ProgressionState;
  currentState = { profile: res.profile, progression };
  setCachedState(progression);
  isOffline = false;
  return currentState!;
}

export function setOfflineState(profile: PlayerProfile, progression: ProgressionState): void {
  currentState = { profile, progression };
  isOffline = true;
}

export function getIsOffline(): boolean {
  return isOffline;
}

export function getCurrentState(): SyncedState | null {
  return currentState;
}

async function postAction(path: string, body: unknown): Promise<void> {
  const res = await apiClient.post(path, body, ActionResponseSchema);
  applyUpdate(res.state as ProgressionState, res.events);
}

export async function talkToNpc(body: TalkToNpcRequest): Promise<void> {
  if (isOffline) return;
  await postAction('/actions/talk-to-npc', body);
}

export async function acceptStoryline(body: AcceptStorylineRequest): Promise<void> {
  if (isOffline) return;
  await postAction('/actions/accept-storyline', body);
}

export async function declineStoryline(body: DeclineStorylineRequest): Promise<void> {
  if (isOffline) return;
  await postAction('/actions/decline-storyline', body);
}

export async function interactWithObject(body: InteractWithObjectRequest): Promise<void> {
  if (isOffline) return;
  await postAction('/actions/interact-with-object', body);
}

export async function enterScene(body: EnterSceneRequest): Promise<void> {
  if (isOffline) return;
  await postAction('/actions/enter-scene', body);
}

export async function updateSettings(body: UpdateSettingsRequest): Promise<void> {
  if (isOffline) return;
  await postAction('/actions/update-settings', body);
}
