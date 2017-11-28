import { Injectable } from '@angular/core';
import { HttpService } from '../providers/httpService';
import { Agency_Info } from '../providers/constants';

@Injectable()
export class AgencyService {
    constructor(public http: HttpService) {

    }

    public static CurrentAgency: any = {};

    getInfo(agencyId: string) {
        return this.http.get(Agency_Info + agencyId, {});
    }
}