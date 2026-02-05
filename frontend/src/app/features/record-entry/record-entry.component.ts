/**
 * Record Entry Component
 * Form to record when Adel said he'd arrive vs when he actually arrived
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { LateReason, VALID_LATE_REASONS, LATE_REASON_LABELS } from '../../core/models/time-entry.model';
import { SharedSecretModalComponent } from '../../shared/components/shared-secret-modal/shared-secret-modal.component';

@Component({
  selector: 'app-record-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedSecretModalComponent],
  templateUrl: './record-entry.component.html',
  styleUrls: ['./record-entry.component.scss']
})
export class RecordEntryComponent {
  private adelTimeService = inject(AdelTimeService);
  private router = inject(Router);

  worldTime = signal('');
  adelTime = signal('');
  reason = signal<LateReason | ''>('');
  loading = signal(false);
  success = signal(false);
  error = signal('');
  isVerified = signal(false);

  // Expose constants to template
  readonly validReasons = VALID_LATE_REASONS;
  readonly reasonLabels = LATE_REASON_LABELS;

  onVerified() {
    this.isVerified.set(true);
  }

  async submit() {
    if (!this.worldTime() || !this.adelTime()) {
      this.error.set('Both times are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.adelTimeService.createEntry({
        worldTime: new Date(this.worldTime()).toISOString(),
        adelTime: new Date(this.adelTime()).toISOString(),
        reason: this.reason() || undefined
      }).toPromise();

      this.success.set(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        this.worldTime.set('');
        this.adelTime.set('');
        this.reason.set('');
        this.success.set(false);
      }, 2000);

    } catch (err) {
      this.error.set('Failed to save entry');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
