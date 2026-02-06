/**
 * Prediction model interfaces
 * Re-exports shared types as the single source of truth
 */

export type {
  PredictionRequest,
  BatchPredictionRequest,
  PredictionResponse,
  BatchPredictionResponse,
  PredictionConfidence,
  SimilarEvents,
  ModelInfo
} from '../../../shared/types/prediction.types';
