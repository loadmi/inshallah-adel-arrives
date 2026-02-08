/**
 * Statistics calculation service
 * - Overall statistics
 * - Time-based breakdowns
 * - Trend analysis
 */

import { timeEntryRepository } from '../database/repositories/time-entry.repository';
import { TimeEntry } from '../models/time-entry.model';
import { Statistics, HourlyStats, DailyStats, Achievement } from '../models/statistics.model';

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
      recentTrend: this.calculateTrend(entries),
      gamification: this.calculateGamification(entries)
    };
  }

  private calculateGamification(entries: TimeEntry[]) {
    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.worldTime).getTime() - new Date(a.worldTime).getTime()
    );

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (consecutive entries with delay <= 5)
    for (const entry of sortedEntries) {
      if (entry.delayMinutes <= 5) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    const chronologicalEntries = [...sortedEntries].reverse();
    for (const entry of chronologicalEntries) {
      if (entry.delayMinutes <= 5) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Calculate Swiss Precision (twice on time in one day)
    const onTimeEntries = entries.filter(e => e.delayMinutes <= 5);
    const entriesByDate = new Map<string, number>();
    onTimeEntries.forEach(e => {
      const dateStr = new Date(e.worldTime).toISOString().split('T')[0];
      entriesByDate.set(dateStr, (entriesByDate.get(dateStr) || 0) + 1);
    });
    const hasSwissPrecision = Array.from(entriesByDate.values()).some(count => count >= 2);

    const allDelays = entries.map(e => e.delayMinutes);
    const onTimePercentage = (allDelays.filter(d => d <= 5).length / allDelays.length) * 100;

    // New calculations for achievements
    const exactOnTimeCount = entries.filter(e => e.delayMinutes === 0).length;
    const lunchBreakOnTimeCount = entries.filter(e => 
      e.delayMinutes <= 5 && e.hourOfDay >= 12 && e.hourOfDay < 14
    ).length;
    const uniqueOnTimeHours = new Set(
      entries.filter(e => e.delayMinutes <= 5).map(e => e.hourOfDay)
    ).size;
    const trend = this.calculateTrend(entries);

    const achievements: Achievement[] = [
      {
        id: 'first_appearance',
        title: 'First Appearance',
        description: 'Arrive for the first time',
        icon: '👣',
        unlocked: entries.length >= 1
      },
      {
        id: 'double_digits',
        title: 'Double Digits',
        description: 'Arrive 10 times',
        icon: '🔟',
        unlocked: entries.length >= 10
      },
      {
        id: 'quarter_century',
        title: 'Quarter Century',
        description: 'Arrive 25 times',
        icon: '🥉',
        unlocked: entries.length >= 25
      },
      {
        id: 'frequent_flyer',
        title: 'Frequent Flyer',
        description: 'Arrive 50 times',
        icon: '✈️',
        unlocked: entries.length >= 50
      },
      {
        id: 'silver_jubilee',
        title: 'Silver Jubilee',
        description: 'Arrive 75 times',
        icon: '🥈',
        unlocked: entries.length >= 75
      },
      {
        id: 'centurion',
        title: 'Centurion',
        description: 'Arrive 100 times',
        icon: '🥇',
        unlocked: entries.length >= 100
      },
      {
        id: 'on_time_hero',
        title: 'On-Time Hero',
        description: 'Arrive within 5 minutes of world time',
        icon: '🦸',
        unlocked: entries.some(e => e.delayMinutes <= 5)
      },
      {
        id: 'streak_3',
        title: 'Hat Trick',
        description: '3 on-time arrivals in a row',
        icon: '🎩',
        unlocked: bestStreak >= 3
      },
      {
        id: 'streak_5',
        title: 'High Five',
        description: '5 on-time arrivals in a row',
        icon: '🖐️',
        unlocked: bestStreak >= 5
      },
      {
        id: 'streak_7',
        title: 'Week of Wonder',
        description: '7 on-time arrivals in a row',
        icon: '🌈',
        unlocked: bestStreak >= 7
      },
      {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Arrive exactly on time (0 min delay)',
        icon: '🐦',
        unlocked: entries.some(e => e.delayMinutes === 0)
      },
      {
        id: 'sniper',
        title: 'Sniper',
        description: 'Arrive exactly on time 3 times',
        icon: '🎯',
        unlocked: exactOnTimeCount >= 3
      },
      {
        id: 'miracle',
        title: 'Miracle',
        description: 'Arrive early (before world time)',
        icon: '✨',
        unlocked: entries.some(e => e.delayMinutes < 0)
      },
      {
        id: 'swiss_precision',
        title: 'Swiss Precision',
        description: 'Arrive on time twice in one day',
        icon: '⌚',
        unlocked: hasSwissPrecision
      },
      {
        id: 'morning_person',
        title: 'Morning Person',
        description: 'Arrive on time before 10 AM',
        icon: '☀️',
        unlocked: entries.some(e => e.delayMinutes <= 5 && e.hourOfDay < 10)
      },
      {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Arrive on time after 10 PM',
        icon: '🦉',
        unlocked: entries.some(e => e.delayMinutes <= 5 && e.hourOfDay >= 22)
      },
      {
        id: 'never_late_for_food',
        title: 'Never late for food.',
        description: 'Arrive on time 3 times between 12 PM and 2 PM',
        icon: '🍕',
        unlocked: lunchBreakOnTimeCount >= 3
      },
      {
        id: 'weekend_warrior',
        title: 'Weekend Warrior',
        description: 'Arrive on time on a Friday or Saturday',
        icon: '🛡️',
        unlocked: entries.some(e => e.delayMinutes <= 5 && (e.dayOfWeek === 5 || e.dayOfWeek === 6))
      },
      {
        id: 'temporal_tourist',
        title: 'Temporal Tourist',
        description: 'Arrive on time in 5 different hours of the day',
        icon: '🗺️',
        unlocked: uniqueOnTimeHours >= 5
      },
      {
        id: 'reformed_character',
        title: 'Reformed Character',
        description: 'Show an improving arrival trend',
        icon: '📈',
        unlocked: trend.improving && entries.length >= 20
      },
      {
        id: 'we_believe_you',
        title: 'We Believe You Now',
        description: 'On-time rate exceeds 50%',
        icon: '🤝',
        unlocked: onTimePercentage > 50
      },
      {
        id: 'the_one_percent',
        title: 'The 1%',
        description: 'Maintain an on-time rate above 90%',
        icon: '💎',
        unlocked: onTimePercentage >= 90 && entries.length >= 20
      }
    ];

    return {
      currentStreak,
      bestStreak,
      achievements
    };
  }

  private calculateHourlyStats(entries: TimeEntry[]): HourlyStats[] {
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

  private calculateDailyStats(entries: TimeEntry[]): DailyStats[] {
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

  private calculateTrend(entries: TimeEntry[]) {
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
      },
      gamification: {
        currentStreak: 0,
        bestStreak: 0,
        achievements: this.getDefaultAchievements()
      }
    };
  }

  private getDefaultAchievements(): Achievement[] {
    return [
      { id: 'first_appearance', title: 'First Appearance', description: 'Arrive for the first time', icon: '👣', unlocked: false },
      { id: 'double_digits', title: 'Double Digits', description: 'Arrive 10 times', icon: '🔟', unlocked: false },
      { id: 'quarter_century', title: 'Quarter Century', description: 'Arrive 25 times', icon: '🥉', unlocked: false },
      { id: 'frequent_flyer', title: 'Frequent Flyer', description: 'Arrive 50 times', icon: '✈️', unlocked: false },
      { id: 'silver_jubilee', title: 'Silver Jubilee', description: 'Arrive 75 times', icon: '🥈', unlocked: false },
      { id: 'centurion', title: 'Centurion', description: 'Arrive 100 times', icon: '🥇', unlocked: false },
      { id: 'on_time_hero', title: 'On-Time Hero', description: 'Arrive within 5 minutes of world time', icon: '🦸', unlocked: false },
      { id: 'streak_3', title: 'Hat Trick', description: '3 on-time arrivals in a row', icon: '🎩', unlocked: false },
      { id: 'streak_5', title: 'High Five', description: '5 on-time arrivals in a row', icon: '🖐️', unlocked: false },
      { id: 'streak_7', title: 'Week of Wonder', description: '7 on-time arrivals in a row', icon: '🌈', unlocked: false },
      { id: 'early_bird', title: 'Early Bird', description: 'Arrive exactly on time (0 min delay)', icon: '🐦', unlocked: false },
      { id: 'sniper', title: 'Sniper', description: 'Arrive exactly on time 3 times', icon: '🎯', unlocked: false },
      { id: 'miracle', title: 'Miracle', description: 'Arrive early (before world time)', icon: '✨', unlocked: false },
      { id: 'swiss_precision', title: 'Swiss Precision', description: 'Arrive on time twice in one day', icon: '⌚', unlocked: false },
      { id: 'morning_person', title: 'Morning Person', description: 'Arrive on time before 10 AM', icon: '☀️', unlocked: false },
      { id: 'night_owl', title: 'Night Owl', description: 'Arrive on time after 10 PM', icon: '🦉', unlocked: false },
      { id: 'never_late_for_food', title: 'Never late for food.', description: 'Arrive on time 3 times between 12 PM and 2 PM', icon: '🍕', unlocked: false },
      { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Arrive on time on a Friday or Saturday', icon: '🛡️', unlocked: false },
      { id: 'temporal_tourist', title: 'Temporal Tourist', description: 'Arrive on time in 5 different hours of the day', icon: '🗺️', unlocked: false },
      { id: 'reformed_character', title: 'Reformed Character', description: 'Show an improving arrival trend', icon: '📈', unlocked: false },
      { id: 'we_believe_you', title: 'We Believe You Now', description: 'On-time rate exceeds 50%', icon: '🤝', unlocked: false },
      { id: 'the_one_percent', title: 'The 1%', description: 'Maintain an on-time rate above 90%', icon: '💎', unlocked: false }
    ];
  }
}

export const statisticsService = new StatisticsService();
