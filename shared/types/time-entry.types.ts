/**
 * Shared Time Entry types
 * Used by both frontend and backend
 */

export interface TimeEntryBase {
  worldTime: Date | string;
  adelTime: Date | string;
  delayMinutes: number;
  hourOfDay: number;
  dayOfWeek: number;
  minutesSinceMidnight: number;
  eventType?: string;
  notes?: string;
}

export interface TimeEntry extends TimeEntryBase {
  id: number;
  createdAt: Date | string;
}

export interface CreateTimeEntryInput {
  worldTime: string;  // ISO date string
  adelTime: string;   // ISO date string
  eventType?: string;
  notes?: string;
}

export type EventType = 'meeting' | 'party' | 'coffee' | 'other';
