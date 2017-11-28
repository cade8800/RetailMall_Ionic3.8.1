import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed',
})
export class ToFixedPipe implements PipeTransform {

  transform(value: number, ...args) {
    let len = args[0];
    if (value && !isNaN(value)) {
      if (!isNaN(len) && len >= 0) {
        return value.toFixed(len);
      } else return value;
    } else return 0.00;
  }

}
