// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'timeAgo'
// })
// export class TimeAgoPipe implements PipeTransform {
//   transform(value: string): string {
//     if (!value) return 'Invalid Date';

//     const inputUtcDate = new Date(value);
//     if (isNaN(inputUtcDate.getTime())) return 'Invalid Date';

//     const inputUtcTimestamp = inputUtcDate.getTime();
//     const currentUtcTimestamp = Date.now();
//     // console.log('Input UTC:', inputUtcDate.toISOString());
//     // console.log('Current UTC:', new Date(currentUtcTimestamp).toISOString());
    
//     const diffMs = currentUtcTimestamp - inputUtcTimestamp;
//     if (diffMs < 0) return 'In the future';

//     const totalSeconds = Math.floor(diffMs / 1000);

//     const diffDays = Math.floor(totalSeconds / (24 * 3600));
//     const diffHours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
//     const diffMinutes = Math.floor((totalSeconds % 3600) / 60);
//     const diffSeconds = totalSeconds % 60;
//     if (diffDays > 30) {
//       const diffMonths = Math.floor(diffDays / 30);
//       const remainingDays = diffDays % 30;
//       return `${diffMonths} months, ${remainingDays} days, ${diffHours} hours, ${diffMinutes} minutes ago`;
//     }
//     // return `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes, and ${diffSeconds} seconds ago`;
//     return `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes ago`;
//   }
// }

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false, // Ensures it updates in real-time
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(months / 12)} years ago`;
  }
}
