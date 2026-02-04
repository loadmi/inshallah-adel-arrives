/**
 * Predict Arrival Component
 * Main prediction interface
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { PredictionResponse } from '../../core/models/prediction.model';

@Component({
  selector: 'app-predict-arrival',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './predict-arrival.component.html',
  styleUrls: ['./predict-arrival.component.scss']
})
export class PredictArrivalComponent {
  private adelTimeService = inject(AdelTimeService);

  worldTime = signal('');
  prediction = signal<PredictionResponse | null>(null);
  loading = signal(false);
  error = signal('');

  async predict() {
    if (!this.worldTime()) {
      this.error.set('Please enter a time');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const result = await this.adelTimeService.getPrediction(
        new Date(this.worldTime())
      ).toPromise();

      this.prediction.set(result!);
    } catch (err) {
      this.error.set('Failed to get prediction');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  getConfidenceColor(level: string): string {
    switch (level) {
      case 'high': return 'green';
      case 'medium': return 'orange';
      case 'low': return 'red';
      default: return 'gray';
    }
  }
}
