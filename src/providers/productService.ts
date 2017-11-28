import { Injectable } from '@angular/core';
import { HttpService } from '../providers/httpService';
import { Product_List, Line_Detail, Hotel_Detail, Ticket_Detail } from '../providers/constants';

@Injectable()
export class ProductService {
    constructor(public http: HttpService) {

    }

    getList(paramObj: any) {
        return this.http.post(Product_List, paramObj);
    }

    getLine(productId: string) {
        return this.http.get(Line_Detail + productId, {});
    }
    getHotel(productId: string) {
        return this.http.get(Hotel_Detail + productId, {});
    }
    getTicket(productId: string) {
        return this.http.get(Ticket_Detail + productId, {});
    }


    getLineChannel(paramObj: string) {
        return this.http.post(Line_Detail, paramObj);
    }
    getHotelChannel(paramObj: string) {
        return this.http.post(Hotel_Detail, paramObj);
    }
    getTicketChannel(paramObj: string) {
        return this.http.post(Ticket_Detail, paramObj);
    }

}