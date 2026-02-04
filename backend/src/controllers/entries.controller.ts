/**
 * Entries controller
 * Handle HTTP requests for entry management
 */

import { Request, Response, NextFunction } from 'express';
import { timeEntryRepository } from '../database/repositories/time-entry.repository';
import { CreateTimeEntryDTO, TimeEntryInput } from '../models/time-entry.model';
import { predictorService } from '../services/ml/predictor.service';
import { logger } from '../utils/logger';

class EntriesController {
  
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input: TimeEntryInput = req.body;

      // Parse dates
      const worldTime = new Date(input.worldTime);
      const adelTime = new Date(input.adelTime);

      // Validate
      if (isNaN(worldTime.getTime()) || isNaN(adelTime.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      // Calculate derived fields
      const delayMinutes = Math.round((adelTime.getTime() - worldTime.getTime()) / 60000);
      const hourOfDay = worldTime.getHours();
      const dayOfWeek = worldTime.getDay();
      const minutesSinceMidnight = hourOfDay * 60 + worldTime.getMinutes();

      // Create DTO
      const dto: CreateTimeEntryDTO = {
        worldTime,
        adelTime,
        delayMinutes,
        hourOfDay,
        dayOfWeek,
        minutesSinceMidnight,
        eventType: input.eventType,
        notes: input.notes
      };

      // Save entry
      const entry = timeEntryRepository.create(dto);

      // Trigger model retraining
      logger.info('Triggering model retraining...');
      predictorService.trainNewModel().catch(err => {
        logger.error('Background training failed:', err);
      });

      res.status(201).json({
        success: true,
        data: entry,
        message: 'Entry created and model retraining initiated'
      });

    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const entries = timeEntryRepository.findAll();
      res.json({ success: true, data: entries });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const entry = timeEntryRepository.findById(id);

      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const deleted = timeEntryRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      // Trigger model retraining
      predictorService.trainNewModel().catch(err => {
        logger.error('Background training failed:', err);
      });

      res.json({ success: true, message: 'Entry deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const entriesController = new EntriesController();
