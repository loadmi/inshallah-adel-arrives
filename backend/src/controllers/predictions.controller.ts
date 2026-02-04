/**
 * Predictions controller
 */

import { Request, Response, NextFunction } from 'express';
import { predictorService } from '../services/ml/predictor.service';
import { modelStorageService } from '../services/ml/model-storage.service';
import { PredictionRequest } from '../models/prediction.model';

class PredictionsController {
  
  async predict(req: Request, res: Response, next: NextFunction) {
    try {
      const input: PredictionRequest = req.body;
      const worldTime = new Date(input.worldTime);

      if (isNaN(worldTime.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const prediction = await predictorService.predict(worldTime);
      
      res.json({ success: true, data: prediction });
    } catch (error) {
      next(error);
    }
  }

  async getModelInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const metadata = modelStorageService.getMetadata();
      
      if (!metadata) {
        return res.json({
          success: true,
          data: {
            exists: false,
            trainedOn: 0
          }
        });
      }

      res.json({
        success: true,
        data: {
          exists: true,
          trainedOn: metadata.trainedOn,
          lastTrained: new Date(metadata.lastTrained),
          version: metadata.version,
          mae: metadata.mae
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const predictionsController = new PredictionsController();
