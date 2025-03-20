import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customNumber'
})
export class CustomNumberPipe implements PipeTransform {
      transform(value: number, separator = ','): string {
        if (isNaN(value)) {
          return 'Invalid number'; // Handle invalid input gracefully
        }
        const parts = value.toString().split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';
    
        return integerPart + decimalPart;
      }
    }
    