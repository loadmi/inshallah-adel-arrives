/**
 * Pipe for AST (Adel Standard Time) display
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'astTime',
  standalone: true
})
export class AstTimePipe implements PipeTransform {
  transform(value: Date | string | null, format: 'short' | 'full' = 'short'): string {
    if (!value) return 'N/A';

    const date = value instanceof Date ? value : new Date(value);
    
    if (isNaN(date.getTime())) return 'Invalid Date';

    if (format === 'short') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ' AST';
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' AST';
  }
}
