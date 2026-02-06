/**
 * Statistics Component
 * Display statistics dashboard with card-based layout
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { Statistics } from '../../core/models/statistics.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  private adelTimeService = inject(AdelTimeService);

  stats = signal<Statistics | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.loadStatistics();
  }

  async loadStatistics() {
    try {
      const result = await firstValueFrom(this.adelTimeService.getStatistics());
      this.stats.set(result);
    } catch (err) {
      this.error.set('Failed to load statistics');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get trend icon based on recent performance
   */
  getTrendIcon(): string {
    if (!this.stats()?.recentTrend) return '📊';
    return this.stats()!.recentTrend.improving ? '📈' : '📉';
  }

  /**
   * Calculate bar width percentage for day statistics visualization
   * Uses the maximum delay as the baseline for 100%
   * @param averageDelay - The average delay for the day
   * @returns Percentage width for the bar (0-100)
   */
  getBarWidth(averageDelay: number): number {
    const stats = this.stats();
    if (!stats || !stats.overall.maxDelay || stats.overall.maxDelay === 0) {
      return 0;
    }
    // Calculate percentage, ensuring minimum visibility for small values
    const percentage = (averageDelay / stats.overall.maxDelay) * 100;
    return Math.max(percentage, 5); // Minimum 5% width for visibility
  }

  /**
   * Get CSS class for delay indicator based on delay value
   * @param delay - Delay in minutes
   * @returns CSS class name
   */
  getDelayClass(delay: number): string {
    if (delay <= 5) return 'good';
    if (delay <= 10) return 'warning';
    return 'bad';
  }
}
