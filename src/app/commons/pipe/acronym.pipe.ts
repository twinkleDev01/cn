import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'acronymOfName',
  pure: true,
})
export class AcronymPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let acronym;
    let specialChar;
    let countLength;
    if (value) {
      acronym = value
        .split(/\s/)
        .reduce((response, word) => (response += word.slice(0, 1)), '');
      countLength = acronym.length;
      if (countLength === 1) {
        acronym = value.substr(0, 2);
      } else if (countLength >= 2) {
        specialChar = acronym.substr(2, 1);
        acronym = acronym.substr(0, 2).replace(/[^\w\s]/gi, specialChar);
      }
    } else acronym = '';
    return acronym.toUpperCase();
  }
}
