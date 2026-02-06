/**
 * Prediction service
 * - Make predictions using trained model
 * - Handle fallback to statistical methods
 * - Calculate confidence metrics
 */

import * as tf from '@tensorflow/tfjs';
import { PredictionResponse } from '../../models/prediction.model';
import { timeEntryRepository } from '../../database/repositories/time-entry.repository';
import { featureEngineeringService } from './feature-engineering.service';
import { modelStorageService } from './model-storage.service';
import { modelTrainerService } from './model-trainer.service';
import { ML_CONFIG } from '../../config/tensorflow';
import { logger } from '../../utils/logger';

export class PredictorService {
  private model: tf.LayersModel | null = null;

  async initialize(): Promise<void> {
    this.model = await modelStorageService.loadModel();
  }

  async predict(worldTime: Date): Promise<PredictionResponse> {
    const entryCount = timeEntryRepository.count();

    // Not enough data - use median fallback
    if (entryCount < ML_CONFIG.training.minSamples) {
      return this.fallbackPrediction(worldTime, entryCount);
    }

    // Ensure model is loaded/trained
    if (!this.model) {
      await this.trainNewModel();
    }

    // Extract features
    const features = featureEngineeringService.extractFeaturesFromDate(worldTime);
    const featureTensor = tf.tensor2d([features]);

    // Predict
    const prediction = this.model!.predict(featureTensor) as tf.Tensor;
    const delayMinutes = Math.round((await prediction.data())[0]);

    // Cleanup
    featureTensor.dispose();
    prediction.dispose();

    // Calculate predicted arrival time
    const predictedAdelTime = new Date(worldTime.getTime() + delayMinutes * 60000);

    // Get confidence metrics
    const confidence = this.calculateConfidence(entryCount, worldTime);

    return {
      worldTime,
      predictedAdelTime,
      delayMinutes,
      confidence,
      similarEvents: this.getSimilarEvents(worldTime)
    };
  }

  async trainNewModel(): Promise<void> {
    logger.info('Training new model...');
    
    const entries = timeEntryRepository.findAll();
    const { features, labels } = featureEngineeringService.prepareTrainingData(entries);
    
    const result = await modelTrainerService.trainModel(features, labels);
    if (!result) {
      logger.error('Failed to train model: not enough data or training failed');
      return;
    }

    const { model, metrics } = result;
    
    await modelStorageService.saveModel(model, {
      version: '1.0',
      trainedOn: entries.length,
      lastTrained: new Date().toISOString(),
      mae: metrics.mae,
      loss: metrics.loss
    });

    this.model = model;
  }

  private fallbackPrediction(worldTime: Date, entryCount: number): PredictionResponse {
    const entries = timeEntryRepository.findAll();
    
    if (entries.length === 0) {
      // No data at all - return 30 min delay as default
      return {
        worldTime,
        predictedAdelTime: new Date(worldTime.getTime() + 30 * 60000),
        delayMinutes: 30,
        confidence: {
          level: 'low',
          dataPointsUsed: 0
        }
      };
    }

    // Use median of all delays
    const delays = entries.map(e => e.delayMinutes).sort((a, b) => a - b);
    const medianDelay = delays[Math.floor(delays.length / 2)];

    return {
      worldTime,
      predictedAdelTime: new Date(worldTime.getTime() + medianDelay * 60000),
      delayMinutes: medianDelay,
      confidence: {
        level: 'low',
        dataPointsUsed: entryCount
      }
    };
  }

  private calculateConfidence(entryCount: number, worldTime: Date) {
    if (entryCount < 10) {
      return { level: 'low' as const, dataPointsUsed: entryCount };
    } else if (entryCount < 30) {
      return { level: 'medium' as const, dataPointsUsed: entryCount };
    } else {
      return { level: 'high' as const, dataPointsUsed: entryCount };
    }
  }

  private getSimilarEvents(worldTime: Date) {
    const entries = timeEntryRepository.findAll();
    const hour = worldTime.getHours();
    
    const similarEntries = entries.filter(e => 
      Math.abs(e.hourOfDay - hour) <= 2
    );

    if (similarEntries.length === 0) {
      return undefined;
    }

    const averageDelay = similarEntries.reduce((sum, e) => sum + e.delayMinutes, 0) 
                        / similarEntries.length;

    return {
      averageDelay: Math.round(averageDelay),
      count: similarEntries.length
    };
  }
}

export const predictorService = new PredictorService();
