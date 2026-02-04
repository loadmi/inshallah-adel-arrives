/**
 * Time Entry model (frontend)
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

export interface CreateTimeEntryRequest {
  worldTime: string;
  adelTime: string;
  reason?: LateReason;
}
