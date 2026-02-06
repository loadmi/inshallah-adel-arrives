import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { Statistics, Achievement } from '../../core/models/statistics.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-adel-mode',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './adel-mode.component.html',
  styleUrls: ['./adel-mode.component.scss']
})
export class AdelModeComponent implements OnInit {
  private adelTimeService = inject(AdelTimeService);

  stats = signal<Statistics | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadStats();
  }

  async loadStats(): Promise<void> {
    try {
      const result = await this.adelTimeService.getStatistics().toPromise();
      this.stats.set(result!);
    } catch (err) {
      this.error.set('Failed to load your legendary stats, Adel.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  get unlockedAchievements(): Achievement[] {
    return this.stats()?.gamification.achievements.filter(a => a.unlocked) || [];
  }

  get lockedAchievements(): Achievement[] {
    return this.stats()?.gamification.achievements.filter(a => !a.unlocked) || [];
  }

  get streakMessage(): string {
    const streak = this.stats()?.gamification.currentStreak || 0;
    if (streak === 0) return "Time to start a new legacy, Adel. The world is waiting (literally).";
    if (streak < 3) return "Nice start! Keep it up and people might actually stop checking their watches.";
    if (streak < 7) return "You're on fire! Is this even the real Adel anymore?";
    return "LEGENDARY! You've transcended the Adel Standard Time. We're proud of you.";
  }
}
