/**
 * Feature engineering service
 * - Extract features from raw data
 * - Cyclical encoding for temporal features
 * - Prepare data for training/prediction
 */

import { TimeEntry } from '../../models/time-entry.model';
import { timeEntryRepository } from '../../database/repositories/time-entry.repository';

export class FeatureEngineeringService {
  
  /**
   * Extract features from a TimeEntry record.
   * Features:
   *   [0] hourSin       - sin(2π * hour / 24)
   *   [1] hourCos       - cos(2π * hour / 24)
   *   [2] daySin        - sin(2π * dayOfWeek / 7)
   *   [3] dayCos        - cos(2π * dayOfWeek / 7)
   *   [4] isWeekend     - 1 if Saturday/Sunday, 0 otherwise
   *   [5] rollingAvgDelay - rolling average delay of last N entries (normalized)
   */
  extractFeatures(entry: TimeEntry): number[] {
    const rollingAvg = this.getRollingAverageDelay();

    return [
      ...this.cyclicalHour(entry.hourOfDay),
      ...this.cyclicalDay(entry.dayOfWeek),
      this.isWeekend(entry.dayOfWeek),
      this.normalizeDelay(rollingAvg)
    ];
  }

  extractFeaturesFromDate(date: Date): number[] {
    const hourOfDay = date.getHours();
    const dayOfWeek = date.getDay();
    const rollingAvg = this.getRollingAverageDelay();

    return [
      ...this.cyclicalHour(hourOfDay),
      ...this.cyclicalDay(dayOfWeek),
      this.isWeekend(dayOfWeek),
      this.normalizeDelay(rollingAvg)
    ];
  }

  prepareTrainingData(entries: TimeEntry[]): {
    features: number[][];
    labels: number[];
  } {
    // Pre-compute rolling averages for training data
    // For each entry at index i, the rolling average uses entries before it
    const features: number[][] = [];
    const labels: number[] = [];

    // Entries are sorted by created_at DESC from the repository,
    // so reverse to get chronological order for rolling average
    const chronological = [...entries].reverse();

    for (let i = 0; i < chronological.length; i++) {
      const entry = chronological[i];
      
      // Compute rolling average from previous entries
      const previousEntries = chronological.slice(Math.max(0, i - 10), i);
      const rollingAvg = previousEntries.length > 0
        ? previousEntries.reduce((sum, e) => sum + e.delayMinutes, 0) / previousEntries.length
        : 30; // Default delay when no history

      const feature = [
        ...this.cyclicalHour(entry.hourOfDay),
        ...this.cyclicalDay(entry.dayOfWeek),
        this.isWeekend(entry.dayOfWeek),
        this.normalizeDelay(rollingAvg)
      ];

      features.push(feature);
      labels.push(entry.delayMinutes);
    }
    
    return { features, labels };
  }

  /**
   * Cyclical encoding for hour of day using sin/cos transform.
   * This ensures hour 23 and hour 0 are treated as close neighbors.
   */
  private cyclicalHour(hour: number): [number, number] {
    const radians = (2 * Math.PI * hour) / 24;
    return [Math.sin(radians), Math.cos(radians)];
  }

  /**
   * Cyclical encoding for day of week using sin/cos transform.
   * This ensures Sunday (0) and Saturday (6) are treated as close neighbors.
   */
  private cyclicalDay(day: number): [number, number] {
    const radians = (2 * Math.PI * day) / 7;
    return [Math.sin(radians), Math.cos(radians)];
  }

  /**
   * Binary feature: 1 if weekend (Saturday=6 or Sunday=0), 0 otherwise.
   */
  private isWeekend(dayOfWeek: number): number {
    return (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;
  }

  /**
   * Normalize delay to roughly [0, 1] range.
   * Caps at 120 minutes to avoid outlier influence.
   */
  private normalizeDelay(minutes: number): number {
    return Math.min(minutes, 120) / 120;
  }

  /**
   * Get the rolling average delay from the most recent N entries.
   */
  private getRollingAverageDelay(n: number = 10): number {
    const entries = timeEntryRepository.findAll(); // Sorted by created_at DESC
    if (entries.length === 0) return 30; // Default

    const recent = entries.slice(0, n);
    return recent.reduce((sum, e) => sum + e.delayMinutes, 0) / recent.length;
  }
}

export const featureEngineeringService = new FeatureEngineeringService();
