/**
 * TensorFlow configuration
 * - Model architecture
 * - Training hyperparameters
 * - Feature descriptions
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
    // Feature descriptions (6 total):
    // [0] hourSin              - sin(2π * hour / 24)
    // [1] hourCos              - cos(2π * hour / 24)
    // [2] daySin               - sin(2π * dayOfWeek / 7)
    // [3] dayCos               - cos(2π * dayOfWeek / 7)
    // [4] isWeekend            - 0 or 1
    // [5] rollingAvgDelay      - normalized [0, 1]
  },
  
  modelArchitecture: {
    inputSize: 6,  // [hourSin, hourCos, daySin, dayCos, isWeekend, rollingAvgDelay]
    hiddenLayers: [32, 16, 8],
    outputSize: 1  // delay in minutes
  }
};
