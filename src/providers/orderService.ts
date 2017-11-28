import { Injectable } from '@angular/core';
import { HttpService } from '../providers/httpService';
import { Order_Submit, Order_Peer_Submit, Order_GetList, Order_GetDetail, Order_Cancel, Order } from '../providers/constants';

@Injectable()
export class OrderService {
    constructor(public http: HttpService) {

    }

    submitOrder(paramObj: any) {
        return this.http.post(Order_Submit, paramObj);
    }

    submitPeerOrder(paramObj: any) {
        return this.http.post(Order_Peer_Submit, paramObj);
    }

    getList(paramObj: any) {
        return this.http.post(Order_GetList, paramObj);
    }

    getDetail(paramObj: any) {
        return this.http.get(Order_GetDetail, paramObj);
    }

    cancelOrder(orderId: string) {
        return this.http.get(Order_Cancel + orderId, {});
    }

    updateOrderInfo(paramObj: any) {
        return this.http.put(Order, paramObj);
    }
}