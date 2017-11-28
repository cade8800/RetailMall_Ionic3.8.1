import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { Invoice } from './constants';

@Injectable()
export class InvoiceService {

    constructor(public http: HttpService) { }

    get() {
        return this.http.get(Invoice, {});
    }
    delete(shippingId: string) {
        return this.http.delete(Invoice + shippingId);
    }
    add(paramObj: any) {
        return this.http.post(Invoice, paramObj);
    }
    update(shippingId: string, paramObj: any) {
        return this.http.put(Invoice + shippingId, paramObj);
    }

}