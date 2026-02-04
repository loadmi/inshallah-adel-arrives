/**
 * ML Model training service
 * - Train new model from scratch
 * - Evaluate model performance
 * - Return training metrics
 */

import * as tf from '@tensorflow/tfjs';
import { ML_CONFIG } from '../../config/tensorflow';
import { logger } from '../../utils/logger';

export class ModelTrainerService {
  
  async trainModel(
    features: number[][],
    labels: number[]
  ): Promise<{ model: tf.LayersModel; metrics: TrainingMetrics }> {
    
    logger.info(`Training model on ${features.length} samples`);

    // Convert to tensors
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    // Create model
    const model = this.createModel();

    // Compile model
    model.compile({
      optimizer: tf.train.adam(ML_CONFIG.training.learningRate),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    // Train model
    const history = await model.fit(xs, ys, {
      epochs: ML_CONFIG.training.epochs,
      batchSize: ML_CONFIG.training.batchSize,
      validationSplit: ML_CONFIG.training.validationSplit,
      verbose: 0,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 20 === 0) {
            logger.info(`Epoch ${epoch}: loss=${logs?.loss.toFixed(4)}, mae=${logs?.mae.toFixed(2)}`);
          }
        }
      }
    });

    // Calculate metrics
    const finalMetrics = {
      loss: history.history.loss[history.history.loss.length - 1] as number,
      mae: history.history.mae[history.history.mae.length - 1] as number,
      valLoss: history.history.val_loss?.[history.history.val_loss.length - 1] as number,
      valMae: history.history.val_mae?.[history.history.val_mae.length - 1] as number,
      epochs: ML_CONFIG.training.epochs,
      sampleCount: features.length
    };

    // Cleanup tensors
    xs.dispose();
    ys.dispose();

    logger.info(`Training complete. MAE: ${finalMetrics.mae.toFixed(2)} minutes`);

    return { model, metrics: finalMetrics };
  }

  private createModel(): tf.LayersModel {
    const model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({
      inputShape: [ML_CONFIG.modelArchitecture.inputSize],
      units: ML_CONFIG.modelArchitecture.hiddenLayers[0],
      activation: 'relu',
      kernelInitializer: 'heNormal'
    }));

    // Hidden layers
    for (let i = 1; i < ML_CONFIG.modelArchitecture.hiddenLayers.length; i++) {
      model.add(tf.layers.dense({
        units: ML_CONFIG.modelArchitecture.hiddenLayers[i],
        activation: 'relu'
      }));
    }

    // Output layer
    model.add(tf.layers.dense({
      units: ML_CONFIG.modelArchitecture.outputSize,
      activation: 'linear'
    }));

    return model;
  }
}

export interface TrainingMetrics {
  loss: number;
  mae: number;
  valLoss?: number;
  valMae?: number;
  epochs: number;
  sampleCount: number;
}

export const modelTrainerService = new ModelTrainerService();
