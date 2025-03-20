import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titleCase'})
export class TitleCasePipe implements PipeTransform {
    public transform(input:string): string{
        if (typeof input !== 'string' || !input) {
            return '';
        } else {
           let inputData= input?.toLocaleLowerCase()
            return inputData.replace(/\b\w/g, first => first.toLocaleUpperCase()) 
        }
    } 
}