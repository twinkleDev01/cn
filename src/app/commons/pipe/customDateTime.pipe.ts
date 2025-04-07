import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'customDateTime'
})
export class CustomDateTimePipe implements PipeTransform {
  transform(value: Date | string, getFrequency = false): string {
    const date = moment(value);
    
    if (date.isSame(moment(), 'day')) {
      return getFrequency ? 'daily' : date.format('h A'); // Example: 01 PM or 10 AM
    }
    
    if (date.isSame(moment(), 'week')) {
      return getFrequency ? 'weekly' : date.format('dddd h A'); // Example: Monday 10 PM
    }
    
    if (date.isSame(moment(), 'year')) {
      return getFrequency ? 'monthly' : date.format('DD MMM, h A'); // Example: 10 Jul, 10 PM
    }
    
    return getFrequency ? 'yearly' : date.format('DD MMM YYYY, h A'); // Example: 10 Jul 2023, 10 PM
  }
}
 