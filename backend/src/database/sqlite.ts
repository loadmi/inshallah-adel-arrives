/**
 * SQLite database connection using sql.js (pure JavaScript)
 */

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { DATABASE_CONFIG } from '../config/database';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

let db: SqlJsDatabase | null = null;
let SQL: initSqlJs.SqlJsStatic | null = null;

export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs();
    
    // Ensure data directory exists
    const dbDir = path.dirname(DATABASE_CONFIG.path);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Load existing database or create new one
    if (fs.existsSync(DATABASE_CONFIG.path)) {
      const buffer = fs.readFileSync(DATABASE_CONFIG.path);
      db = new SQL.Database(buffer);
      logger.info(`Database loaded from ${DATABASE_CONFIG.path}`);
    } else {
      db = new SQL.Database();
      logger.info('Created new database');
    }
    
    // Create schema
    db.run(DATABASE_CONFIG.schema.entries);
    
    // Create indexes
    DATABASE_CONFIG.schema.indexes.forEach(index => {
      db!.run(index);
    });

    // Save to disk
    saveDatabase();

    logger.info(`Database initialized at ${DATABASE_CONFIG.path}`);
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

export function saveDatabase(): void {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DATABASE_CONFIG.path, buffer);
  }
}

export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
    logger.info('Database connection closed');
  }
}
