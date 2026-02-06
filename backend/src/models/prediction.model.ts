/**
 * Prediction model interfaces
 */

export interface PredictionRequest {
  worldTime: string;  // ISO date string
}

export interface BatchPredictionRequest {
  worldTimes: string[]; // Array of ISO date strings
}

export interface PredictionResponse {
  worldTime: Date;
  predictedAdelTime: Date;
  delayMinutes: number;
  confidence: {
    level: 'low' | 'medium' | 'high';
    percentage?: number;
    dataPointsUsed: number;
  };
  similarEvents?: {
    averageDelay: number;
    count: number;
  };
}

export interface BatchPredictionResponse {
  predictions: PredictionResponse[];
}

export interface ModelInfo {
  exists: boolean;
  trainedOn: number;  // number of samples
  lastTrained?: Date;
  version: string;
}
