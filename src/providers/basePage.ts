import { AccountService } from '../providers/accountService';
import { UrlHelper } from './utils';
declare var shareModel: any;

export class BasePage {

    constructor(public accountService: AccountService) {
        let agencyId = this.getAgencyId();
        if (agencyId && this.accountService)
            this.accountService.addLog(agencyId).then().catch();
    }

    public getAgencyId() {
        let agencyId = this.getUrlParam("Id") || this.getUrlParam("id") || this.getUrlParam("ID") || this.getUrlParam("iD");
        if (agencyId) {
            localStorage.setItem("agencyId", agencyId);
            return agencyId;
        } else {
            agencyId = localStorage.getItem("agencyId");
            if (agencyId) return agencyId;
        }
        return null;
    }

    public getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2];
        return null; //返回参数值
    }


    public uutShareInit(agencyName, agencyImg) {
        shareModel.init(UrlHelper.shareUrl(), {
            webLink: UrlHelper.retailMallUrl() + '?id=' + this.getAgencyId(),
            title: agencyName,
            content: '您贴心的旅游管家',
            thumbnailUrl: '',
            shareType: 1
        });
    }
    public uutShareProductInit(productId, productName, productImg, productType) {
        shareModel.init(UrlHelper.shareUrl(), {
            webLink: UrlHelper.retailMallUrl() + '?id=' + this.getAgencyId() + '&ptype=' + productType + '&pid=' + productId,
            title: productName,
            content: '向您推荐的旅游产品',
            thumbnailUrl: UrlHelper.retailMallUrl() + productImg,
            shareType: 1
        });
    }
    public uutShare() {
        shareModel.open();
    }
}