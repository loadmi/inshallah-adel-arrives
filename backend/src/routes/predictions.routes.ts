/**
 * Prediction routes
 * POST /api/predictions/predict  - Get prediction
 * GET  /api/predictions/model-info - Get model info
 */

import { Router } from 'express';
import { predictionsController } from '../controllers/predictions.controller';

const router = Router();

router.post('/predict', predictionsController.predict);
router.post('/predict-batch', predictionsController.predictBatch);
router.get('/model-info', predictionsController.getModelInfo);

export default router;
