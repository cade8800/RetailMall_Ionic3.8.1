import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentState',
})
export class PaymentStatePipe implements PipeTransform {

  transform(value: string, ...args) {
    let visitorType = { 0: '待付款', 1: '已付款' };
    value = visitorType[value];
    if (value) return value;
    else return '';
  }
}
