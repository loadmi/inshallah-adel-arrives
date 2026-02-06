/**
 * Prediction model (frontend)
 */

export interface PredictionRequest {
  worldTime: string;
}

export interface BatchPredictionRequest {
  worldTimes: string[];
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
