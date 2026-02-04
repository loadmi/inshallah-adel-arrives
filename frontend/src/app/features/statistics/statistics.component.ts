/**
 * Statistics Component
 * Display statistics dashboard
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { Statistics } from '../../core/models/statistics.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
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
      const result = await this.adelTimeService.getStatistics().toPromise();
      this.stats.set(result!);
    } catch (err) {
      this.error.set('Failed to load statistics');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  getTrendIcon(): string {
    if (!this.stats()?.recentTrend) return '📊';
    return this.stats()!.recentTrend.improving ? '📈' : '📉';
  }
}
