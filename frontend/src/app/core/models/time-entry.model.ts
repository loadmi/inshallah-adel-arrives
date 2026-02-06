/**
 * Time Entry model (frontend)
 * Re-exports shared types as the single source of truth
 */

export type { LateReason, TimeEntry } from '@shared/types/time-entry.types';
export { VALID_LATE_REASONS, LATE_REASON_LABELS } from '@shared/types/time-entry.types';

// Frontend-specific alias for API request body
export { CreateTimeEntryInput as CreateTimeEntryRequest } from '@shared/types/time-entry.types';
