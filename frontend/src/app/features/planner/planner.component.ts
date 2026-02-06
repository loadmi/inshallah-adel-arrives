import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { DateUtilsService } from '../../core/services/date-utils.service';
import { PredictionResponse } from '../../core/models/prediction.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

interface PlannerSlot {
  time: Date;
  prediction?: PredictionResponse;
}

interface PlannerDay {
  date: Date;
  slots: PlannerSlot[];
}

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  private adelTimeService = inject(AdelTimeService);
  private dateUtilsService = inject(DateUtilsService);

  days = signal<PlannerDay[]>([]);
  loading = signal(false);
  error = signal('');
  selectedSlot = signal<PlannerSlot | null>(null);

  bestSlot = computed(() => {
    const allSlots = this.days().flatMap(d => d.slots);
    const predictedSlots = allSlots.filter(s => s.prediction);
    if (predictedSlots.length === 0) return null;

    return predictedSlots.reduce((best, current) => {
      if (!best.prediction || !current.prediction) return current;
      return current.prediction.delayMinutes < best.prediction.delayMinutes ? current : best;
    });
  });

  ngOnInit(): void {
    this.generatePlanner();
  }

  async generatePlanner(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const plannerDays: PlannerDay[] = [];
      const now = new Date();
      now.setMinutes(0, 0, 0);

      const allTimes: Date[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        
        const slots: PlannerSlot[] = [];
        // Full 24-hour cycle
        for (let hour = 0; hour < 24; hour++) {
          const slotTime = new Date(date);
          slotTime.setHours(hour);
          
          // Only add future slots
          if (slotTime > new Date()) {
            slots.push({ time: slotTime });
            allTimes.push(slotTime);
          }
        }
        
        if (slots.length > 0) {
          plannerDays.push({ date, slots });
        }
      }

      const predictions = await firstValueFrom(this.adelTimeService.getBatchPredictions(allTimes));

      if (predictions) {
        let predIdx = 0;
        for (const day of plannerDays) {
          for (const slot of day.slots) {
            slot.prediction = predictions[predIdx++];
          }
        }
      }

      this.days.set(plannerDays);
    } catch (err) {
      this.error.set('Failed to load planner data');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  getDelayClass(delay: number): string {
    if (delay <= 15) return 'delay-low';
    if (delay <= 45) return 'delay-medium';
    return 'delay-high';
  }

  selectSlot(slot: PlannerSlot): void {
    this.selectedSlot.set(slot);
  }

  closeDetails(): void {
    this.selectedSlot.set(null);
  }

  formatDay(date: Date): string {
    return this.dateUtilsService.getDayName(date.getDay());
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTime(date: Date): string {
    return this.dateUtilsService.formatTime(date);
  }

  formatDuration(minutes: number): string {
    return this.dateUtilsService.formatDuration(minutes);
  }
}
