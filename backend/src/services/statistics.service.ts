/**
 * Statistics calculation service
 * - Overall statistics
 * - Time-based breakdowns
 * - Trend analysis
 */

import { timeEntryRepository } from '../database/repositories/time-entry.repository';
import { Statistics, HourlyStats, DailyStats } from '../models/statistics.model';

export class StatisticsService {
  
  calculateStatistics(): Statistics {
    const entries = timeEntryRepository.findAll();

    if (entries.length === 0) {
      return this.emptyStatistics();
    }

    const delays = entries.map(e => e.delayMinutes);

    return {
      overall: {
        totalEntries: entries.length,
        averageDelay: this.average(delays),
        medianDelay: this.median(delays),
        maxDelay: Math.max(...delays),
        minDelay: Math.min(...delays),
        standardDeviation: this.standardDeviation(delays),
        onTimePercentage: (delays.filter(d => d <= 5).length / delays.length) * 100
      },
      byHour: this.calculateHourlyStats(entries),
      byDay: this.calculateDailyStats(entries),
      recentTrend: this.calculateTrend(entries)
    };
  }

  private calculateHourlyStats(entries: any[]): HourlyStats[] {
    const hourlyMap = new Map<number, number[]>();

    entries.forEach(entry => {
      if (!hourlyMap.has(entry.hourOfDay)) {
        hourlyMap.set(entry.hourOfDay, []);
      }
      hourlyMap.get(entry.hourOfDay)!.push(entry.delayMinutes);
    });

    const stats: HourlyStats[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const delays = hourlyMap.get(hour) || [];
      if (delays.length > 0) {
        stats.push({
          hour,
          averageDelay: this.average(delays),
          count: delays.length
        });
      }
    }

    return stats;
  }

  private calculateDailyStats(entries: any[]): DailyStats[] {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyMap = new Map<number, number[]>();

    entries.forEach(entry => {
      if (!dailyMap.has(entry.dayOfWeek)) {
        dailyMap.set(entry.dayOfWeek, []);
      }
      dailyMap.get(entry.dayOfWeek)!.push(entry.delayMinutes);
    });

    const stats: DailyStats[] = [];
    for (let day = 0; day < 7; day++) {
      const delays = dailyMap.get(day) || [];
      if (delays.length > 0) {
        stats.push({
          dayOfWeek: day,
          dayName: dayNames[day],
          averageDelay: this.average(delays),
          count: delays.length
        });
      }
    }

    return stats;
  }

  private calculateTrend(entries: any[]) {
    if (entries.length < 20) {
      return {
        improving: false,
        last10Average: 0,
        previous10Average: 0
      };
    }

    const last10 = entries.slice(0, 10).map(e => e.delayMinutes);
    const previous10 = entries.slice(10, 20).map(e => e.delayMinutes);

    const last10Avg = this.average(last10);
    const previous10Avg = this.average(previous10);

    return {
      improving: last10Avg < previous10Avg,
      last10Average: last10Avg,
      previous10Average: previous10Avg
    };
  }

  private average(numbers: number[]): number {
    return Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length);
  }

  private median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private standardDeviation(numbers: number[]): number {
    const avg = this.average(numbers);
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
    return Math.round(Math.sqrt(this.average(squareDiffs)));
  }

  private emptyStatistics(): Statistics {
    return {
      overall: {
        totalEntries: 0,
        averageDelay: 0,
        medianDelay: 0,
        maxDelay: 0,
        minDelay: 0,
        standardDeviation: 0,
        onTimePercentage: 0
      },
      byHour: [],
      byDay: [],
      recentTrend: {
        improving: false,
        last10Average: 0,
        previous10Average: 0
      }
    };
  }
}

export const statisticsService = new StatisticsService();
