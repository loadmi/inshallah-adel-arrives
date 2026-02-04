/**
 * History Component
 * View and manage past entries with card-based grid layout
 */

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdelTimeService } from '../../core/services/adel-time.service';
import { TimeEntry, LateReason, LATE_REASON_LABELS } from '../../core/models/time-entry.model';

type FilterType = 'all' | 'on-time' | 'late' | 'very-late';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  private adelTimeService = inject(AdelTimeService);

  // Data signals
  entries = signal<TimeEntry[]>([]);
  loading = signal(true);
  error = signal('');

  // Filter signals
  searchQuery = signal('');
  activeFilter = signal<FilterType>('all');
  entryToDelete = signal<TimeEntry | null>(null);

  // Computed filtered entries
  filteredEntries = computed(() => {
    let result = this.entries();
    
    // Apply search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(entry => {
        const reasonLabel = entry.reason ? this.getReasonLabel(entry.reason).toLowerCase() : '';
        return reasonLabel.includes(query) ||
          new Date(entry.createdAt).toLocaleDateString().includes(query);
      });
    }
    
    // Apply delay filter
    const filter = this.activeFilter();
    if (filter !== 'all') {
      result = result.filter(entry => {
        const delayClass = this.getDelayClass(entry.delayMinutes);
        if (filter === 'on-time') return delayClass === 'on-time';
        if (filter === 'late') return delayClass === 'slightly-late' || delayClass === 'late';
        if (filter === 'very-late') return delayClass === 'very-late';
        return true;
      });
    }
    
    return result;
  });

  /**
   * Get human-readable label for a late reason
   */
  getReasonLabel(reason: LateReason): string {
    return LATE_REASON_LABELS[reason] || reason;
  }

  ngOnInit() {
    this.loadEntries();
  }

  async loadEntries() {
    this.loading.set(true);
    this.error.set('');
    
    try {
      const result = await this.adelTimeService.getAllEntries().toPromise();
      this.entries.set(result || []);
    } catch (err) {
      this.error.set('Failed to load entries. Please try again.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  // Filter methods
  setFilter(filter: FilterType) {
    this.activeFilter.set(filter);
  }

  filterEntries() {
    // Triggered by search input - filteredEntries computed will update automatically
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  clearAllFilters() {
    this.searchQuery.set('');
    this.activeFilter.set('all');
  }

  // Delete methods
  confirmDelete(entry: TimeEntry) {
    this.entryToDelete.set(entry);
  }

  cancelDelete() {
    this.entryToDelete.set(null);
  }

  async deleteEntry(id: number) {
    try {
      await this.adelTimeService.deleteEntry(id).toPromise();
      this.entries.set(this.entries().filter(e => e.id !== id));
      this.entryToDelete.set(null);
    } catch (err) {
      this.error.set('Failed to delete entry. Please try again.');
      console.error(err);
    }
  }

  // Utility method for delay classification
  getDelayClass(minutes: number): string {
    if (minutes <= 5) return 'on-time';
    if (minutes <= 15) return 'slightly-late';
    if (minutes <= 30) return 'late';
    return 'very-late';
  }
}
