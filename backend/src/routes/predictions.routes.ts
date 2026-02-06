/**
 * Prediction routes
 * POST /api/predictions/predict       - Get prediction
 * POST /api/predictions/predict-batch - Get batch predictions
 * GET  /api/predictions/model-info    - Get model info
 */

import { Router } from 'express';
import { predictionsController } from '../controllers/predictions.controller';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

router.post('/predict', validateBody(['worldTime']), predictionsController.predict.bind(predictionsController));
router.post('/predict-batch', validateBody(['worldTimes']), predictionsController.predictBatch.bind(predictionsController));
router.get('/model-info', predictionsController.getModelInfo.bind(predictionsController));

export default router;
