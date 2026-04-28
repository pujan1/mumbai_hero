import type { ZodSchema } from 'zod';
import { API_BASE_URL } from '../config/constants.js';
import { getPlayerId } from './local-cache.js';

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  schema: ZodSchema<T>,
): Promise<T> {
  const playerId = getPlayerId();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (playerId) headers['X-Player-Id'] = playerId;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error: string }).error ?? res.statusText);
  }

  const data = await res.json();
  return schema.parse(data);
}

export const apiClient = {
  get: <T>(path: string, schema: ZodSchema<T>) => request<T>('GET', path, undefined, schema),
  post: <T>(path: string, body: unknown, schema: ZodSchema<T>) =>
    request<T>('POST', path, body, schema),
};
