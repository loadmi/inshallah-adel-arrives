/**
 * Date manipulation utilities
 */

export function calculateDelayMinutes(worldTime: Date, adelTime: Date): number {
  return Math.round((adelTime.getTime() - worldTime.getTime()) / 60000);
}

export function getHourOfDay(date: Date): number {
  return date.getHours();
}

export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

export function getMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function parseISODate(isoString: string): Date | null {
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
}
