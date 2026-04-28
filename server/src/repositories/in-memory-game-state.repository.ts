import fs from 'fs';
import path from 'path';
import type { GameEvent, PlayerProfile, ProgressionState } from '@mumbai-hero/shared';
import type { GameStateRepository } from './game-state.repository.js';
import { logger } from '../utils/logger.js';

interface PlayerRecord {
  profile: PlayerProfile;
  progression: ProgressionState;
  events: GameEvent[];
}

interface DbShape {
  players: Record<string, PlayerRecord>;
}

export class InMemoryGameStateRepository implements GameStateRepository {
  private db: Map<string, PlayerRecord> = new Map();
  private saveTimer: NodeJS.Timeout | null = null;
  private readonly dbPath: string;
  private readonly saveIntervalMs: number;

  constructor(dbPath: string, saveIntervalMs: number) {
    this.dbPath = dbPath;
    this.saveIntervalMs = saveIntervalMs;
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    if (!fs.existsSync(this.dbPath)) return;
    try {
      const raw = fs.readFileSync(this.dbPath, 'utf-8');
      const parsed = JSON.parse(raw) as DbShape;
      for (const [id, record] of Object.entries(parsed.players)) {
        this.db.set(id, record);
      }
      logger.info('Loaded DB from disk', { playerCount: this.db.size });
    } catch (err) {
      logger.error('Failed to load DB from disk', { err: String(err) });
    }
  }

  private scheduleSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveToDisk(), this.saveIntervalMs);
  }

  saveToDisk(): void {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const shape: DbShape = { players: {} };
      for (const [id, record] of this.db.entries()) {
        shape.players[id] = record;
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(shape, null, 2), 'utf-8');
      logger.debug('Saved DB to disk');
    } catch (err) {
      logger.error('Failed to save DB to disk', { err: String(err) });
    }
  }

  async createPlayer(profile: PlayerProfile, initialState: ProgressionState): Promise<void> {
    this.db.set(profile.playerId, { profile, progression: initialState, events: [] });
    this.scheduleSave();
  }

  async getProfile(playerId: string): Promise<PlayerProfile | null> {
    return this.db.get(playerId)?.profile ?? null;
  }

  async getProgression(playerId: string): Promise<ProgressionState | null> {
    return this.db.get(playerId)?.progression ?? null;
  }

  async saveProgression(playerId: string, state: ProgressionState): Promise<void> {
    const record = this.db.get(playerId);
    if (!record) throw new Error(`Player ${playerId} not found`);
    record.progression = state;
    this.scheduleSave();
  }

  async appendEvents(playerId: string, events: GameEvent[]): Promise<void> {
    const record = this.db.get(playerId);
    if (!record) throw new Error(`Player ${playerId} not found`);
    record.events.push(...events);
    this.scheduleSave();
  }

  async getRecentEvents(playerId: string, limit: number): Promise<GameEvent[]> {
    const events = this.db.get(playerId)?.events ?? [];
    return events.slice(-limit);
  }
}
