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

export type StatedActivity = 
  | 'showering' 
  | 'making_food' 
  | 'heading_home' 
  | 'in_meeting' 
  | 'work_stuff' 
  | 'another_event' 
  | 'helping_family' 
  | 'gaming' 
  | 'other';

export const VALID_STATED_ACTIVITIES: StatedActivity[] = [
  'showering', 
  'making_food', 
  'heading_home', 
  'in_meeting', 
  'work_stuff', 
  'another_event', 
  'helping_family', 
  'gaming', 
  'other'
];

export const STATED_ACTIVITY_LABELS: Record<StatedActivity, string> = {
  showering: 'Showering',
  making_food: 'Making food',
  heading_home: 'Heading Home',
  in_meeting: 'In a meeting',
  work_stuff: 'Doing Work stuff',
  another_event: 'At another event',
  helping_family: 'Helping Family',
  gaming: 'Finishing up in a game',
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
  statedActivity?: StatedActivity;
}

export interface TimeEntry extends TimeEntryBase {
  id: number;
  createdAt: Date | string;
}

export interface CreateTimeEntryInput {
  worldTime: string;  // ISO date string
  adelTime: string;   // ISO date string
  reason?: LateReason;
  statedActivity?: StatedActivity;
}
