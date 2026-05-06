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
    throw new Error(getErrorMessage(err, res.statusText));
  }

  const data = await res.json();
  return schema.parse(data);
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== 'object' || err === null) return fallback;
  if (!('error' in err)) return fallback;
  return typeof err.error === 'string' ? err.error : fallback;
}

export const apiClient = {
  get: <T>(path: string, schema: ZodSchema<T>) => request<T>('GET', path, undefined, schema),
  post: <T>(path: string, body: unknown, schema: ZodSchema<T>) =>
    request<T>('POST', path, body, schema),
};
