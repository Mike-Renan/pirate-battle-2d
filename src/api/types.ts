import { GameConfig } from '../game/config/gameConfig';

export interface MatchRecord {
  id: string;
  playerId: string;
  playerName: string;
  date: string; // ISO String (ex: 2026-10-02T20:00:00Z)
  score: number;
  duration: number; // Tempo em segundos
  reason: 'died' | 'time_up' | 'abandoned';
  config: GameConfig;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}