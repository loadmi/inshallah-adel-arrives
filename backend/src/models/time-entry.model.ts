/**
 * Time Entry data model
 * - Interface definitions
 * - DTOs for create/update
 * - Validation schemas
 */

// Valid late reason values
export type LateReason = 'traffic' | 'family_emergency' | 'work_emergency' | 'technical_difficulties' | 'other';

export const VALID_LATE_REASONS: LateReason[] = [
  'traffic',
  'family_emergency',
  'work_emergency',
  'technical_difficulties',
  'other'
];

export interface TimeEntry {
  id: number;
  worldTime: Date;
  adelTime: Date;
  delayMinutes: number;
  hourOfDay: number;
  dayOfWeek: number;
  minutesSinceMidnight: number;
  reason?: LateReason;
  createdAt: Date;
}

export interface CreateTimeEntryDTO {
  worldTime: Date;
  adelTime: Date;
  delayMinutes: number;
  hourOfDay: number;
  dayOfWeek: number;
  minutesSinceMidnight: number;
  reason?: LateReason;
}

export interface TimeEntryInput {
  worldTime: string;  // ISO date string
  adelTime: string;   // ISO date string
  reason?: LateReason;
}
