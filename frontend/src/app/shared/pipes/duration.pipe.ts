/**
 * Duration formatting pipe
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null): string {
    if (minutes === null || minutes === undefined) return 'N/A';

    if (minutes < 0) {
      return `${Math.abs(minutes)} min early`;
    }

    if (minutes === 0) {
      return 'On time!';
    }

    if (minutes < 60) {
      return `${minutes} min late`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return `${hours}h late`;
    }

    return `${hours}h ${mins}m late`;
  }
}
