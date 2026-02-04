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

    // Run migrations for existing databases
    runMigrations();

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

/**
 * Run schema migrations for existing databases
 * Handles transition from old schema (event_type/notes) to new schema (reason)
 */
function runMigrations(): void {
  if (!db) return;

  try {
    // Get current table schema
    const tableInfo = db.exec("PRAGMA table_info(entries)");
    if (tableInfo.length === 0 || !tableInfo[0].values) return;

    const columns = tableInfo[0].values.map((row: any[]) => row[1] as string);
    
    // Check if we have the old schema (event_type/notes) but not the new (reason)
    const hasOldSchema = columns.includes('event_type') || columns.includes('notes');
    const hasReasonColumn = columns.includes('reason');

    // Migration: Add reason column if it doesn't exist
    if (!hasReasonColumn) {
      logger.info('Running migration: Adding reason column to entries table');
      db.run('ALTER TABLE entries ADD COLUMN reason TEXT');
      
      // Optionally migrate notes data to reason (if notes column exists)
      if (columns.includes('notes')) {
        logger.info('Migrating notes data to reason column');
        db.run('UPDATE entries SET reason = notes WHERE notes IS NOT NULL AND notes != ""');
      }
      
      logger.info('Migration completed: reason column added');
    }

    // Note: SQLite doesn't support DROP COLUMN in older versions,
    // so we leave event_type/notes columns in place if they exist
    if (hasOldSchema) {
      logger.info('Old schema columns (event_type/notes) detected but retained for backward compatibility');
    }
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}
