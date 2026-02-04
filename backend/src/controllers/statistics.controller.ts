/**
 * Statistics controller
 */

import { Request, Response, NextFunction } from 'express';
import { statisticsService } from '../services/statistics.service';

class StatisticsController {
  
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = statisticsService.calculateStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}

export const statisticsController = new StatisticsController();
