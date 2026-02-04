/**
 * Predict Arrival Component
 * Main prediction interface with card-based grid layout
 */

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { DateUtilsService } from '../../core/services/date-utils.service';
import { PredictionResponse } from '../../core/models/prediction.model';

@Component({
  selector: 'app-predict-arrival',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './predict-arrival.component.html',
  styleUrls: ['./predict-arrival.component.scss']
})
export class PredictArrivalComponent implements OnInit {
  private adelTimeService = inject(AdelTimeService);
  private dateUtilsService = inject(DateUtilsService);

  /** User-selected world time input */
  worldTime = signal('');
  
  /** Prediction response from the API */
  prediction = signal<PredictionResponse | null>(null);
  
  /** Loading state for async operations */
  loading = signal(false);
  
  /** Error message to display */
  error = signal('');

  private predictTimeout: any;

  ngOnInit(): void {
    // Initialize with current time
    const now = new Date();
    this.worldTime.set(this.dateUtilsService.toLocalDateTimeString(now));
    
    // Initial prediction
    this.predict();
  }

  /**
   * Resets the world time to the current time
   */
  resetToNow(): void {
    const now = new Date();
    this.worldTime.set(this.dateUtilsService.toLocalDateTimeString(now));
    this.predict();
  }

  /**
   * Fetches prediction from the API based on the selected world time
   * Includes a small debounce to prevent excessive API calls
   */
  predict(): void {
    if (this.predictTimeout) {
      clearTimeout(this.predictTimeout);
    }

    this.predictTimeout = setTimeout(async () => {
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
    }, 300);
  }
}
