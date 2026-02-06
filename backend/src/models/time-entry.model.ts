/**
 * Time Entry data model
 * Re-exports shared types and adds backend-specific DTOs
 */

// Re-export shared types as the single source of truth
export { LateReason, VALID_LATE_REASONS, LATE_REASON_LABELS } from '../../../shared/types/time-entry.types';
export type { TimeEntry } from '../../../shared/types/time-entry.types';

import type { LateReason } from '../../../shared/types/time-entry.types';

/**
 * DTO for creating a new time entry (backend-specific, with computed fields)
 */
export interface CreateTimeEntryDTO {
  worldTime: Date;
  adelTime: Date;
  delayMinutes: number;
  hourOfDay: number;
  dayOfWeek: number;
  minutesSinceMidnight: number;
  reason?: LateReason;
}

/**
 * Input from API requests (raw string dates)
 */
export interface TimeEntryInput {
  worldTime: string;  // ISO date string
  adelTime: string;   // ISO date string
  reason?: LateReason;
}
