/**
 * Predictions controller
 */

import { Request, Response, NextFunction } from 'express';
import { predictorService } from '../services/ml/predictor.service';
import { modelStorageService } from '../services/ml/model-storage.service';
import { PredictionRequest, BatchPredictionRequest } from '../models/prediction.model';
import { successResponse, errorResponse } from '../utils/response';

class PredictionsController {
  
  async predict(req: Request, res: Response, next: NextFunction) {
    try {
      const input: PredictionRequest = req.body;
      const worldTime = new Date(input.worldTime);

      if (isNaN(worldTime.getTime())) {
        return res.status(400).json(errorResponse('Invalid date format'));
      }

      const prediction = await predictorService.predict(worldTime);
      
      res.json(successResponse(prediction));
    } catch (error) {
      next(error);
    }
  }

  async predictBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const input: BatchPredictionRequest = req.body;
      
      if (!input.worldTimes || !Array.isArray(input.worldTimes)) {
        return res.status(400).json(errorResponse('worldTimes must be an array'));
      }

      const worldTimes = input.worldTimes.map(t => new Date(t));
      
      if (worldTimes.some(t => isNaN(t.getTime()))) {
        return res.status(400).json(errorResponse('Invalid date format in worldTimes'));
      }

      const predictions = await predictorService.predictBatch(worldTimes);
      
      res.json(successResponse({ predictions }));
    } catch (error) {
      next(error);
    }
  }

  async getModelInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const metadata = modelStorageService.getMetadata();
      
      if (!metadata) {
        return res.json(successResponse({
          exists: false,
          trainedOn: 0
        }));
      }

      res.json(successResponse({
        exists: true,
        trainedOn: metadata.trainedOn,
        lastTrained: new Date(metadata.lastTrained),
        version: metadata.version,
        mae: metadata.mae
      }));
    } catch (error) {
      next(error);
    }
  }
}

export const predictionsController = new PredictionsController();
