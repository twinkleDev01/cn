import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {
  transform(value: string | Date): Date {
    if (!value) return new Date(); // fallback
    return new Date(value + ' UTC');
  }
}
