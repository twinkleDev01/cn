// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'utcDate'
// })
// export class UtcDatePipe implements PipeTransform {

//   transform(value: string | Date): string {
//     if (!value) return 'Invalid Date';

//     // Convert string to Date object
//     const date = new Date(value);

//     // Check if the date is valid
//     if (isNaN(date.getTime())) return 'Invalid Date';

//     // Convert to UTC string format
//     return date.toISOString(); // Example output: "2025-03-26T10:43:41.000Z"
//   }
// }
// OLd
// New
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return 'Invalid Date';
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toISOString();
  }
}