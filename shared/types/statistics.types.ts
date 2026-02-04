/**
 * Shared Statistics types
 * Used by both frontend and backend
 */

export interface OverallStatistics {
  totalEntries: number;
  averageDelay: number;
  medianDelay: number;
  maxDelay: number;
  minDelay: number;
  standardDeviation: number;
  onTimePercentage: number;
}

export interface HourlyStats {
  hour: number;
  averageDelay: number;
  count: number;
}

export interface DailyStats {
  dayOfWeek: number;
  dayName: string;
  averageDelay: number;
  count: number;
}

export interface RecentTrend {
  improving: boolean;
  last10Average: number;
  previous10Average: number;
}

export interface Statistics {
  overall: OverallStatistics;
  byHour: HourlyStats[];
  byDay: DailyStats[];
  recentTrend: RecentTrend;
}
