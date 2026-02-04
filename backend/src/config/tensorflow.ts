/**
 * TensorFlow configuration
 * - Model architecture
 * - Training hyperparameters
 * - Feature normalization settings
 */

export const ML_CONFIG = {
  modelPath: process.env.MODEL_PATH || './data/models',
  
  training: {
    minSamples: parseInt(process.env.MIN_TRAINING_SAMPLES || '10'),
    epochs: parseInt(process.env.TRAINING_EPOCHS || '100'),
    batchSize: parseInt(process.env.BATCH_SIZE || '16'),
    validationSplit: 0.2,
    learningRate: 0.01
  },
  
  features: {
    // Feature names and normalization ranges
    hourOfDay: { max: 24, min: 0 },
    dayOfWeek: { max: 7, min: 0 },
    minutesSinceMidnight: { max: 1440, min: 0 }
  },
  
  modelArchitecture: {
    inputSize: 3,  // [hourOfDay, dayOfWeek, minutesSinceMidnight]
    hiddenLayers: [16, 8],
    outputSize: 1  // delay in minutes
  }
};
