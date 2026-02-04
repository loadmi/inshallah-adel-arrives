/**
 * Time Entry model (frontend)
 */

export interface TimeEntry {
  id: number;
  worldTime: Date;
  adelTime: Date;
  delayMinutes: number;
  hourOfDay: number;
  dayOfWeek: number;
  minutesSinceMidnight: number;
  eventType?: string;
  notes?: string;
  createdAt: Date;
}

export interface CreateTimeEntryRequest {
  worldTime: string;
  adelTime: string;
  eventType?: string;
  notes?: string;
}
