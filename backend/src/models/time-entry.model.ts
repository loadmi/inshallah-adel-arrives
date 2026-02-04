/**
 * Time Entry data model
 * - Interface definitions
 * - DTOs for create/update
 * - Validation schemas
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

export interface CreateTimeEntryDTO {
  worldTime: Date;
  adelTime: Date;
  delayMinutes: number;
  hourOfDay: number;
  dayOfWeek: number;
  minutesSinceMidnight: number;
  eventType?: string;
  notes?: string;
}

export interface TimeEntryInput {
  worldTime: string;  // ISO date string
  adelTime: string;   // ISO date string
  eventType?: string;
  notes?: string;
}
