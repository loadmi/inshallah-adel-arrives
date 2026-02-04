/**
 * Data validation service
 * - Validate input data
 * - Sanitize strings
 */

import { TimeEntryInput } from '../models/time-entry.model';
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

    return {
      valid: true,
      data: {
        worldTime: input.worldTime,
        adelTime: input.adelTime,
        eventType: input.eventType,
        notes: input.notes
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
