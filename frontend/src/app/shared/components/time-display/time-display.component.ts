/**
 * Custom time display component
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.scss']
})
export class TimeDisplayComponent {
  @Input() label = '';
  @Input() time: Date | null = null;
  @Input() highlight = false;
}
