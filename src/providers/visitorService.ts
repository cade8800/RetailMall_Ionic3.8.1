import { Injectable } from '@angular/core';
import { HttpService } from '../providers/httpService';
import { Visitor_Delete, Visitor_Get, Visitor_Inster, Visitor_Update } from './constants';

@Injectable()
export class VisitorService {
    constructor(public http: HttpService) {

    }

    select() {
        return this.http.get(Visitor_Get, {});
    }
    delete(visitorId: string) {
        return this.http.get(Visitor_Delete + visitorId, {});
    }
    update(paramObj: any) {
        return this.http.post(Visitor_Update, paramObj);
    }
    insert(paramObj: any) {
        return this.http.post(Visitor_Inster, paramObj);
    }
}