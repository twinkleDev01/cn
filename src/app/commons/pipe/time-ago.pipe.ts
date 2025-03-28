import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  // standalone: false // set to true only if you're using standalone pipe (Angular 15+)
})
export class TimeAgoPipe implements PipeTransform {

  transform(timestamp: string | Date): string {
    if (!timestamp) return 'Unknown';

    const accessedDate = new Date(timestamp);
    const now = new Date();

    const diffMs = now.getTime() - accessedDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;

    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    if (months > 0 && days > 0) return `${months} months ${days} days ago`;
    if (months > 0) return `${months} months ago`;
    return `${diffDays} days ago`;
  }
}
