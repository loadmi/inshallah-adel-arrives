/**
 * Entry management routes
 * POST   /api/entries        - Create new entry
 * GET    /api/entries        - Get all entries
 * GET    /api/entries/:id    - Get entry by ID
 * DELETE /api/entries/:id    - Delete entry
 */

import { Router } from 'express';
import { entriesController } from '../controllers/entries.controller';

const router = Router();

router.post('/', entriesController.create);
router.get('/', entriesController.getAll);
router.get('/:id', entriesController.getById);
router.delete('/:id', entriesController.delete);

export default router;
