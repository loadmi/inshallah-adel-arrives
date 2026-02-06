/**
 * Statistics controller
 */

import { Request, Response, NextFunction } from 'express';
import { statisticsService } from '../services/statistics.service';
import { successResponse } from '../utils/response';

class StatisticsController {
  
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = statisticsService.calculateStatistics();
      res.json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  }
}

export const statisticsController = new StatisticsController();
