import { Injectable } from '@angular/core';
import { HttpService } from '../providers/httpService';
import { Account_Info, Contact_Info, Add_AccessLog } from '../providers/constants';

@Injectable()
export class AccountService {
    constructor(public http: HttpService) {

    }

    getInfo() {
        return this.http.get(Account_Info, {});
    }

    getContact() {
        return this.http.get(Contact_Info, {})
    }

    addLog(agencyId: string) {
        return this.http.get(Add_AccessLog + agencyId, {});
    }
}