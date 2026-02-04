/**
 * Feature engineering service
 * - Extract features from raw data
 * - Normalize features
 * - Prepare data for training/prediction
 */

import { TimeEntry } from '../../models/time-entry.model';

export class FeatureEngineeringService {
  
  extractFeatures(entry: TimeEntry): number[] {
    return [
      this.normalizeHour(entry.hourOfDay),
      this.normalizeDayOfWeek(entry.dayOfWeek),
      this.normalizeMinutesSinceMidnight(entry.minutesSinceMidnight)
    ];
  }

  extractFeaturesFromDate(date: Date): number[] {
    const hourOfDay = date.getHours();
    const dayOfWeek = date.getDay();
    const minutesSinceMidnight = hourOfDay * 60 + date.getMinutes();

    return [
      this.normalizeHour(hourOfDay),
      this.normalizeDayOfWeek(dayOfWeek),
      this.normalizeMinutesSinceMidnight(minutesSinceMidnight)
    ];
  }

  prepareTrainingData(entries: TimeEntry[]): {
    features: number[][];
    labels: number[];
  } {
    const features = entries.map(entry => this.extractFeatures(entry));
    const labels = entries.map(entry => entry.delayMinutes);
    
    return { features, labels };
  }

  private normalizeHour(hour: number): number {
    return hour / 24;
  }

  private normalizeDayOfWeek(day: number): number {
    return day / 7;
  }

  private normalizeMinutesSinceMidnight(minutes: number): number {
    return minutes / 1440;
  }
}

export const featureEngineeringService = new FeatureEngineeringService();
