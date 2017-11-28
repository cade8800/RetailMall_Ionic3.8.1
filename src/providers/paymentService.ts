import { Injectable } from '@angular/core';
import { HttpService } from '../providers/httpService';
import { Payment_Confirm, Payment_CallBack } from '../providers/constants';

@Injectable()
export class PaymentService {

    constructor(private http: HttpService) { }

    paymentConfirm(orderId: string) {
        return this.http.get(Payment_Confirm + orderId, {});
    }

    paymentCallBack(formData: string) {
        return this.http.post(Payment_CallBack + '?formData=' + formData, {});
    }
}