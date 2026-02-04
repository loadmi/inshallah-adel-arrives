/**
 * Shared Time Entry types
 * Used by both frontend and backend
 */

export type LateReason = 'traffic' | 'family_emergency' | 'work_emergency' | 'technical_difficulties' | 'other';

export const VALID_LATE_REASONS: LateReason[] = ['traffic', 'family_emergency', 'work_emergency', 'technical_difficulties', 'other'];

export const LATE_REASON_LABELS: Record<LateReason, string> = {
  traffic: 'Traffic',
  family_emergency: 'Family emergency',
  work_emergency: 'Work emergency',
  technical_difficulties: 'Technical difficulties',
  other: 'Other'
};

export interface TimeEntryBase {
  worldTime: Date | string;
  adelTime: Date | string;
  delayMinutes: number;
  hourOfDay: number;
  dayOfWeek: number;
  minutesSinceMidnight: number;
  reason?: LateReason;
}

export interface TimeEntry extends TimeEntryBase {
  id: number;
  createdAt: Date | string;
}

export interface CreateTimeEntryInput {
  worldTime: string;  // ISO date string
  adelTime: string;   // ISO date string
  reason?: LateReason;
}
