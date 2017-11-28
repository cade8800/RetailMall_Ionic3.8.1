import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { Shipping } from './constants';

@Injectable()
export class ShippingService {

    constructor(private http: HttpService) { }

    get() {
        return this.http.get(Shipping, {});
    }
    delete(shippingId: string) {
        return this.http.delete(Shipping + shippingId);
    }
    add(paramObj: any) {
        return this.http.post(Shipping, paramObj);
    }
    update(shippingId: string, paramObj: any) {
        return this.http.put(Shipping + shippingId, paramObj);
    }

}