import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertEnd'
})
export class ConvertEndPipe implements PipeTransform {
  
  transform(value: string): string {
    if (!value) return value;

    // Regular expressions to find specific suffixes
    const patterns = [
      { regex: /\s*INC\s*$/i, replacement: ' Inc' },
      { regex: /\s*LLC\s*$/i, replacement: ' LLC' },
      { regex: /\s*LLP\s*$/i, replacement: ' LLP' },
      { regex: /\s*DBA\s*$/i, replacement: ' DBA' },
      { regex: /\s*LP\s*$/i, replacement: ' LP' },
      { regex: /\s*S Corp\s*$/i, replacement: ' S Corp' },
      { regex: /\s*C Corp\s*$/i, replacement: ' C Corp' },
      { regex: /\s*S Corporation\s*$/i, replacement: ' S Corporation' },
    ];

    // Iterate through patterns to find a match and replace
    for (const { regex, replacement } of patterns) {
      if (regex.test(value)) {
        return value.replace(regex, replacement);
      }
    }
    
    return value; // return original if no matches found
  }
}
