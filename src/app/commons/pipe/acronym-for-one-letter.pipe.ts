import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronymForOneLetter',
  pure: true, // Ensures the pipe is pure and runs only when the input changes
})
export class AcronymForOneLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    // Trim the input, take the first letter of the first word, and convert it to uppercase
    return value.trim().charAt(0).toUpperCase();
  }
}
