import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textOverflowEllipsis',
})
export class TextOverflowEllipsisPipe implements PipeTransform {

  transform(value: string, ...args) {
    let len = args[0][0];
    if (value && len && !isNaN(len)) {
      if (value.length > len) {
        value = (value.substring(0, len) + "...");
      }
    }
    return value;
  }

}
