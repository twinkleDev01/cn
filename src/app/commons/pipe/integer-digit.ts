import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'integerPart'
})
export class IntegerPartPipe implements PipeTransform {
    transform(value: number): string {
        if (isNaN(value)) {
          return '';
        }
        // Convert the number to an integer and format it with commas
        const integerPart = Math.floor(value);
        return integerPart.toLocaleString();
      }
}
