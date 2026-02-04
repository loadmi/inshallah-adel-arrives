/**
 * History Component
 * View and manage past entries
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { TimeEntry } from '../../core/models/time-entry.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  private adelTimeService = inject(AdelTimeService);

  entries = signal<TimeEntry[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.loadEntries();
  }

  async loadEntries() {
    try {
      const result = await this.adelTimeService.getAllEntries().toPromise();
      this.entries.set(result!);
    } catch (err) {
      this.error.set('Failed to load entries');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteEntry(id: number) {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await this.adelTimeService.deleteEntry(id).toPromise();
      this.entries.set(this.entries().filter(e => e.id !== id));
    } catch (err) {
      this.error.set('Failed to delete entry');
      console.error(err);
    }
  }

  getDelayClass(minutes: number): string {
    if (minutes <= 5) return 'on-time';
    if (minutes <= 15) return 'slightly-late';
    if (minutes <= 30) return 'late';
    return 'very-late';
  }
}
