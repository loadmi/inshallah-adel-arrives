/**
 * Statistics routes
 * GET /api/statistics/summary - Overall statistics
 */

import { Router } from 'express';
import { statisticsController } from '../controllers/statistics.controller';

const router = Router();

router.get('/summary', statisticsController.getSummary.bind(statisticsController));

export default router;
