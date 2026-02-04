/**
 * Shared Prediction types
 * Used by both frontend and backend
 */

export interface PredictionRequest {
  worldTime: string;  // ISO date string
}

export interface PredictionConfidence {
  level: 'low' | 'medium' | 'high';
  percentage?: number;
  dataPointsUsed: number;
}

export interface SimilarEvents {
  averageDelay: number;
  count: number;
}

export interface PredictionResponse {
  worldTime: Date | string;
  predictedAdelTime: Date | string;
  delayMinutes: number;
  confidence: PredictionConfidence;
  similarEvents?: SimilarEvents;
}

export interface ModelInfo {
  exists: boolean;
  trainedOn: number;
  lastTrained?: Date | string;
  version: string;
  mae?: number;
}
