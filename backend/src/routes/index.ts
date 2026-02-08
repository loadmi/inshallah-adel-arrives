/**
 * API routes aggregation
 */

import { Router } from 'express';
import entriesRouter from './entries.routes';
import predictionsRouter from './predictions.routes';
import statisticsRouter from './statistics.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/entries', entriesRouter);
router.use('/predictions', predictionsRouter);
router.use('/statistics', statisticsRouter);

export default router;
