import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'CustomDate',
})
export class CustomDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: string | Date): string {
    if (!value) return 'Unknown';

    const parsedDate = new Date(value);
    return this.datePipe.transform(parsedDate, 'd MMM yyyy') || 'Invalid Date';
  }

}
