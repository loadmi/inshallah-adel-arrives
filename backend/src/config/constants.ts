/**
 * Application constants
 */

export const APP_CONSTANTS = {
  APP_NAME: 'Adel Standard Time',
  VERSION: '1.0.0',
  
  // Default delay if no data available (in minutes)
  DEFAULT_DELAY: 30,
  
  // On-time threshold (minutes)
  ON_TIME_THRESHOLD: 5,
  
  // Event types
  EVENT_TYPES: ['meeting', 'party', 'coffee', 'other'] as const
};
