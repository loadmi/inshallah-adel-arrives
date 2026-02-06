/**
 * Model storage service
 * - Save model to disk
 * - Load model from disk
 * - Manage model versions
 */

import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import * as path from 'path';
import { ML_CONFIG } from '../../config/tensorflow';
import { logger } from '../../utils/logger';

export class ModelStorageService {
  private readonly modelPath: string;
  private readonly metadataPath: string;
  private readonly weightsPath: string;

  constructor() {
    this.modelPath = path.join(ML_CONFIG.modelPath, 'model.json');
    this.metadataPath = path.join(ML_CONFIG.modelPath, 'metadata.json');
    this.weightsPath = path.join(ML_CONFIG.modelPath, 'weights.bin');
    
    // Ensure directory exists
    if (!fs.existsSync(ML_CONFIG.modelPath)) {
      fs.mkdirSync(ML_CONFIG.modelPath, { recursive: true });
    }
  }

  async saveModel(
    model: tf.LayersModel,
    metadata: ModelMetadata
  ): Promise<void> {
    try {
      // Use custom IOHandler to save model to file system
      await model.save(tf.io.withSaveHandler(async (artifacts: tf.io.ModelArtifacts) => {
        // Save model topology
        const modelJSON = {
          modelTopology: artifacts.modelTopology,
          weightsManifest: [{
            paths: ['weights.bin'],
            weights: artifacts.weightSpecs
          }],
          format: artifacts.format,
          generatedBy: artifacts.generatedBy,
          convertedBy: artifacts.convertedBy
        };
        
        fs.writeFileSync(this.modelPath, JSON.stringify(modelJSON, null, 2));
        
        // Save weights as binary
        if (artifacts.weightData) {
          const weightBuffer = Buffer.from(artifacts.weightData as ArrayBuffer);
          fs.writeFileSync(this.weightsPath, weightBuffer);
        }
        
        return {
          modelArtifactsInfo: {
            dateSaved: new Date(),
            modelTopologyType: 'JSON'
          }
        };
      }));
      
      // Save metadata
      fs.writeFileSync(
        this.metadataPath,
        JSON.stringify(metadata, null, 2)
      );

      logger.info('Model saved successfully');
    } catch (error) {
      logger.error('Failed to save model:', error);
      throw error;
    }
  }

  async loadModel(): Promise<tf.LayersModel | null> {
    try {
      if (!this.modelExists()) {
        return null;
      }

      // Read model topology
      const modelJSON = JSON.parse(fs.readFileSync(this.modelPath, 'utf-8'));
      
      // Read weights
      const weightsBuffer = fs.readFileSync(this.weightsPath);
      const weightData = new Uint8Array(weightsBuffer).buffer;
      
      // Create IOHandler for loading
      const handler: tf.io.IOHandler = {
        load: async () => {
          return {
            modelTopology: modelJSON.modelTopology,
            weightSpecs: modelJSON.weightsManifest[0].weights,
            weightData: weightData,
            format: modelJSON.format,
            generatedBy: modelJSON.generatedBy,
            convertedBy: modelJSON.convertedBy
          };
        }
      };

      const model = await tf.loadLayersModel(handler);
      logger.info('Model loaded successfully');
      return model;
    } catch (error) {
      logger.error('Failed to load model:', error);
      return null;
    }
  }

  getMetadata(): ModelMetadata | null {
    try {
      if (!fs.existsSync(this.metadataPath)) {
        return null;
      }

      const data = fs.readFileSync(this.metadataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to load metadata:', error);
      return null;
    }
  }

  modelExists(): boolean {
    return fs.existsSync(this.modelPath) && fs.existsSync(this.weightsPath);
  }

  deleteModel(): void {
    try {
      if (fs.existsSync(this.modelPath)) {
        fs.unlinkSync(this.modelPath);
      }
      if (fs.existsSync(this.metadataPath)) {
        fs.unlinkSync(this.metadataPath);
      }
      if (fs.existsSync(this.weightsPath)) {
        fs.unlinkSync(this.weightsPath);
      }

      logger.info('Model deleted');
    } catch (error) {
      logger.error('Failed to delete model:', error);
    }
  }
}

export interface ModelMetadata {
  version: string;
  trainedOn: number;
  lastTrained: string;
  mae: number;
  loss: number;
}

export const modelStorageService = new ModelStorageService();
