import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return 'Invalid Date';

    const inputUtcDate = new Date(value);
    if (isNaN(inputUtcDate.getTime())) return 'Invalid Date';

    const inputUtcTimestamp = inputUtcDate.getTime();
    const currentUtcTimestamp = Date.now();
    // console.log('Input UTC:', inputUtcDate.toISOString());
    // console.log('Current UTC:', new Date(currentUtcTimestamp).toISOString());
    
    const diffMs = currentUtcTimestamp - inputUtcTimestamp;
    if (diffMs < 0) return 'In the future';

    const totalSeconds = Math.floor(diffMs / 1000);

    const diffDays = Math.floor(totalSeconds / (24 * 3600));
    const diffHours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const diffMinutes = Math.floor((totalSeconds % 3600) / 60);
    const diffSeconds = totalSeconds % 60;
    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return `${diffMonths} months, ${remainingDays} days, ${diffHours} hours, ${diffMinutes} minutes ago`;
    }
    // return `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes, and ${diffSeconds} seconds ago`;
    return `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes ago`;
  }
}

