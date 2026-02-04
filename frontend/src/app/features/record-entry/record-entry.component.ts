/**
 * Record Entry Component
 * Form to record when Adel said he'd arrive vs when he actually arrived
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdelTimeService } from '../../core/services/adel-time.service';

@Component({
  selector: 'app-record-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './record-entry.component.html',
  styleUrls: ['./record-entry.component.scss']
})
export class RecordEntryComponent {
  private adelTimeService = inject(AdelTimeService);
  private router = inject(Router);

  worldTime = signal('');
  adelTime = signal('');
  eventType = signal('');
  notes = signal('');
  loading = signal(false);
  success = signal(false);
  error = signal('');

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
        eventType: this.eventType() || undefined,
        notes: this.notes() || undefined
      }).toPromise();

      this.success.set(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        this.worldTime.set('');
        this.adelTime.set('');
        this.eventType.set('');
        this.notes.set('');
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
