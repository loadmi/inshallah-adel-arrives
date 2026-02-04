/**
 * Express server entry point
 * - Initializes database connection
 * - Sets up Express app with middleware
 * - Starts HTTP server
 * - Handles graceful shutdown
 */

import dotenv from 'dotenv';
import { app } from './app';
import { initializeDatabase } from './database/sqlite';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized');

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
