// Date utility functions

import { format, formatDistance, formatDistanceToNow } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Format time for display
 */
export function formatTime(date: string | Date): string {
  return format(new Date(date), 'h:mm a');
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${mins} min`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Check if quest is active
 */
export function isQuestActive(startDate: string, endDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
}

/**
 * Check if quest is upcoming
 */
export function isQuestUpcoming(startDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  return now < start;
}

/**
 * Check if quest is expired
 */
export function isQuestExpired(endDate: string): boolean {
  const now = new Date();
  const end = new Date(endDate);
  return now > end;
}


