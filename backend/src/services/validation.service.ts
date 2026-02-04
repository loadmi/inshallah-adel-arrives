/**
 * Data validation service
 * - Validate input data
 * - Sanitize strings
 */

import { TimeEntryInput, LateReason, VALID_LATE_REASONS } from '../models/time-entry.model';
import { PredictionRequest } from '../models/prediction.model';

export class ValidationService {
  
  validateTimeEntryInput(input: any): { valid: boolean; error?: string; data?: TimeEntryInput } {
    if (!input.worldTime || !input.adelTime) {
      return { valid: false, error: 'Both worldTime and adelTime are required' };
    }

    const worldTime = new Date(input.worldTime);
    const adelTime = new Date(input.adelTime);

    if (isNaN(worldTime.getTime())) {
      return { valid: false, error: 'Invalid worldTime format' };
    }

    if (isNaN(adelTime.getTime())) {
      return { valid: false, error: 'Invalid adelTime format' };
    }

    // Validate reason if provided
    if (input.reason && !VALID_LATE_REASONS.includes(input.reason as LateReason)) {
      return { 
        valid: false, 
        error: `Invalid reason. Must be one of: ${VALID_LATE_REASONS.join(', ')}` 
      };
    }

    return {
      valid: true,
      data: {
        worldTime: input.worldTime,
        adelTime: input.adelTime,
        reason: input.reason
      }
    };
  }

  validatePredictionRequest(input: any): { valid: boolean; error?: string; data?: PredictionRequest } {
    if (!input.worldTime) {
      return { valid: false, error: 'worldTime is required' };
    }

    const worldTime = new Date(input.worldTime);

    if (isNaN(worldTime.getTime())) {
      return { valid: false, error: 'Invalid worldTime format' };
    }

    return {
      valid: true,
      data: {
        worldTime: input.worldTime
      }
    };
  }
}

export const validationService = new ValidationService();
