// import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';

// @Pipe({
//   name: 'frequencyDateTime',
// })
// export class FrequencyDateTimePipe implements PipeTransform {
//   transform(value: any): string {
//     if (!value || !value.frequency) return '';

//     const { frequency, destinationTime, destinationDate, destinationDay } = value;

//     switch (frequency) {
//       case 'daily':
//         return destinationTime ? moment(destinationTime, 'HH:mm:ss').format('h:mm A') : '';

//       case 'weekly':
//         const timeWeekly = destinationTime ? moment(destinationTime, 'HH:mm:ss').format('h:mm A') : '';
//         return destinationDay ? `${destinationDay}, ${timeWeekly}` : timeWeekly;

//       case 'monthly':
//       case 'oneTime':
//         const dateMonthly = destinationDate ? moment(destinationDate).format('MMM DD') : '';
//         const timeMonthly = destinationTime ? moment(destinationTime, 'HH:mm:ss').format('h:mm A') : '';
//         return `${dateMonthly}, ${timeMonthly}`;

//       default:
//         return '';
//     }
//   }
// }
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'frequencyDateTime',
})
export class FrequencyDateTimePipe implements PipeTransform {
  transform(element: any, type: 'source' | 'destination' = 'destination'): string {
    if (!element) return '';

    // Determine which fields to use based on type
    const timeField = `${type}Time`;
    const dateField = `${type}Date`;
    const dayField = `${type}Day`;

    const time = element[timeField];
    if (!time) return '';

    // Parse the time (assuming format "HH:mm:ss")
    const timeMoment = moment(time, 'HH:mm:ss');
    if (!timeMoment.isValid()) return '';

    const formattedTime = timeMoment.format('h:mm A'); // Format as 7:08 AM

    switch (element.frequency?.toLowerCase()) {
      case 'daily':
        // Daily: Show only time
        return formattedTime;

      case 'weekly':
        // Weekly: Show day and time
        const day = element[dayField] || 
                   (element[dateField] ? moment(element[dateField]).format('dddd') : '');
        return `${day}, ${formattedTime}`;

      case 'monthly':
      case 'onetime':
        // Monthly/OneTime: Show date and time
        if (!element[dateField]) return formattedTime;
        const date = moment(element[dateField]);
        if (!date.isValid()) return formattedTime;
        return `${date.format('MMM DD')}, ${formattedTime}`;

      default:
        return formattedTime;
    }
  }
}