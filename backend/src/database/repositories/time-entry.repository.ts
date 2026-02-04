/**
 * Data access layer for time entries using sql.js
 */

import { getDatabase, saveDatabase } from '../sqlite';
import { TimeEntry, CreateTimeEntryDTO } from '../../models/time-entry.model';

export class TimeEntryRepository {
  
  create(entry: CreateTimeEntryDTO): TimeEntry {
    const db = getDatabase();
    
    db.run(`
      INSERT INTO entries (
        world_time, adel_time, delay_minutes,
        hour_of_day, day_of_week, minutes_since_midnight,
        event_type, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      entry.worldTime.toISOString(),
      entry.adelTime.toISOString(),
      entry.delayMinutes,
      entry.hourOfDay,
      entry.dayOfWeek,
      entry.minutesSinceMidnight,
      entry.eventType || null,
      entry.notes || null,
      new Date().toISOString()
    ]);

    // Get the last inserted ID
    const result = db.exec('SELECT last_insert_rowid() as id');
    const lastId = result[0]?.values[0]?.[0] as number;
    
    // Save to disk
    saveDatabase();

    return this.findById(lastId)!;
  }

  findAll(): TimeEntry[] {
    const db = getDatabase();
    const results = db.exec('SELECT * FROM entries ORDER BY created_at DESC');
    
    if (results.length === 0 || results[0].values.length === 0) {
      return [];
    }

    const columns = results[0].columns;
    return results[0].values.map(row => this.mapRowToEntry(columns, row));
  }

  findById(id: number): TimeEntry | null {
    const db = getDatabase();
    const results = db.exec('SELECT * FROM entries WHERE id = ?', [id]);
    
    if (results.length === 0 || results[0].values.length === 0) {
      return null;
    }

    const columns = results[0].columns;
    return this.mapRowToEntry(columns, results[0].values[0]);
  }

  delete(id: number): boolean {
    const db = getDatabase();
    
    // Check if entry exists
    const existing = this.findById(id);
    if (!existing) {
      return false;
    }
    
    db.run('DELETE FROM entries WHERE id = ?', [id]);
    saveDatabase();
    
    return true;
  }

  count(): number {
    const db = getDatabase();
    const results = db.exec('SELECT COUNT(*) as count FROM entries');
    
    if (results.length === 0 || results[0].values.length === 0) {
      return 0;
    }
    
    return results[0].values[0][0] as number;
  }

  private mapRowToEntry(columns: string[], row: any[]): TimeEntry {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    
    return {
      id: obj.id,
      worldTime: new Date(obj.world_time),
      adelTime: new Date(obj.adel_time),
      delayMinutes: obj.delay_minutes,
      hourOfDay: obj.hour_of_day,
      dayOfWeek: obj.day_of_week,
      minutesSinceMidnight: obj.minutes_since_midnight,
      eventType: obj.event_type,
      notes: obj.notes,
      createdAt: new Date(obj.created_at)
    };
  }
}

export const timeEntryRepository = new TimeEntryRepository();
