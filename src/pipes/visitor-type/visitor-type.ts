import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'visitorType',
})
export class VisitorTypePipe implements PipeTransform {

  transform(value: string, ...args) {
    let visitorType = {
      1: '成人',
      2: '儿童',
      3: '老人',
      4: '婴儿',
      5: '领队/全陪',
      6: '司陪'
    };
    value = visitorType[value];
    if (value) return value;
    else return '';
  }

}
