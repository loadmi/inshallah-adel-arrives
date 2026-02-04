/**
 * Statistics model interfaces
 */

export interface Statistics {
  overall: {
    totalEntries: number;
    averageDelay: number;
    medianDelay: number;
    maxDelay: number;
    minDelay: number;
    standardDeviation: number;
    onTimePercentage: number;  // Within 5 minutes
  };
  byHour: HourlyStats[];
  byDay: DailyStats[];
  recentTrend: {
    improving: boolean;
    last10Average: number;
    previous10Average: number;
  };
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
