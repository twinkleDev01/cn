import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'numberFormat',


})
export class NumberFormatPipe  implements PipeTransform{
    transform(value: number): string {
        // Create a formatter for numbers with commas
        const formatter = new Intl.NumberFormat('en-US');
        return formatter.format(value);
      }
        
}