/**
 * Entry management routes
 * POST   /api/entries        - Create new entry
 * GET    /api/entries        - Get all entries
 * GET    /api/entries/:id    - Get entry by ID
 * DELETE /api/entries/:id    - Delete entry
 */

import { Router } from 'express';
import { entriesController } from '../controllers/entries.controller';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

router.post('/', validateBody(['worldTime', 'adelTime']), entriesController.create.bind(entriesController));
router.get('/', entriesController.getAll.bind(entriesController));
router.get('/:id', entriesController.getById.bind(entriesController));
router.delete('/:id', entriesController.delete.bind(entriesController));

export default router;
