import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xmask',
  pure: true,
})
export class XmaskPipe implements PipeTransform {

  transform(email: string): string {
    let parts = email.split('@');
    let message = email.replace(parts[0],'XXXXXXXXXXX');
    return message;
  }
}
