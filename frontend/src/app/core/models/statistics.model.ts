/**
 * Statistics model (frontend)
 */

export interface Statistics {
  overall: {
    totalEntries: number;
    averageDelay: number;
    medianDelay: number;
    maxDelay: number;
    minDelay: number;
    standardDeviation: number;
    onTimePercentage: number;
  };
  byHour: HourlyStats[];
  byDay: DailyStats[];
  recentTrend: {
    improving: boolean;
    last10Average: number;
    previous10Average: number;
  };
  gamification: {
    currentStreak: number;
    bestStreak: number;
    achievements: Achievement[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
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
