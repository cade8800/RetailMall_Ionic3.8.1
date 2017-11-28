import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AlertController } from 'ionic-angular';
import { ToastCtrl } from './toastController';

@Injectable()

export class HttpService {

    constructor(private http: Http,
        private toastCtrl: ToastCtrl,
        public alertCtrl: AlertController) {
    }

    showConfirm() {
        let confirm = this.alertCtrl.create({
            title: '登录提示',
            message: '您还未登录，马上登录？',
            buttons: [{ text: '取消' },
            {
                text: '确定',
                handler: () => {
                    let currentUrl = window.location.href;
                    let loginUrl;
                    if (currentUrl.indexOf("umall.inner.com") > -1) {
                        loginUrl = "http://inner.com/Account/Login?ReturnUrl=" + currentUrl;
                    } else if (currentUrl.indexOf("umall-cs.360uut.com") > -1) {
                        // loginUrl = "http://m.uip-cs.360uut.com/Home/Login?ReturnUrl=" + currentUrl;
                        loginUrl = "http://m.uip-cs.360uut.com/Home/MobileLogin?ReturnUrl=" + currentUrl;
                    } else if (currentUrl.indexOf("umall.360uut.com") > -1) {
                        // loginUrl = "http://mvip.360uut.com/home/Login?ReturnUrl=" + currentUrl;
                        loginUrl = "http://mvip.360uut.com/Home/MobileLogin?ReturnUrl=" + currentUrl;
                    }
                    if (loginUrl) {
                        window.location.href = loginUrl;
                    }
                }
            }]
        });
        confirm.present();
    }

    presentToast(msg: string) {
        this.toastCtrl.show('暂时无法处理您的请求。请稍后再试。');
    }

    public get(url: string, paramObj: any) {
        return this.http.get(url + this.toQueryString(paramObj))
            .toPromise()
            .then(res => this.handleSuccess(res.json()))
            .catch(error => this.handleError(error));
    }

    public post(url: string, paramObj: any) {
        // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        // return this.http.post(url, this.toBodyString(paramObj), new RequestOptions({ headers: headers }))
        return this.http.post(url, paramObj)
            .toPromise()
            .then(res => this.handleSuccess(res.json()))
            .catch(error => this.handleError(error));
    }

    public delete(url: string) {
        return this.http.delete(url)
            .toPromise()
            .then(res => this.handleSuccess(res.json()))
            .catch(error => this.handleError(error));
    }

    public put(url: string, paramObj: any) {
        return this.http.put(url, paramObj)
            .toPromise()
            .then(res => this.handleSuccess(res.json()))
            .catch(error => this.handleError(error));
    }

    public postBody(url: string, paramObj: any) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(url, paramObj, new RequestOptions({ headers: headers }))
            .toPromise()
            .then(res => this.handleSuccess(res.json()))
            .catch(error => this.handleError(error));
    }

    private handleSuccess(result) {
        if (result == null) return { Success: true, Result: result };
        return result;
    }

    private handleError(error: Response | any) {
        let msg = '请求失败';
        if (error.status == 0) {
            msg = '请求地址错误';
            this.presentToast(msg);
        } else if (error.status == 400) {
            msg = '请求无效';
            this.presentToast(msg + "，请检查参数类型是否匹配");
        } else if (error.status == 404) {
            msg = '请求资源不存在';
            this.presentToast(msg + "，请检查路径是否正确");
        } else if (error.status == 401) {

            msg = '用户未登录';
            // this.presentToast(msg + "，请登录后重试");
            this.showConfirm();

        } else {
            this.presentToast(msg);
        }
        return { Success: false, Result: msg };
    }

    /**
     * @param obj　参数对象
     * @return {string}　参数字符串
     * @example
     *  声明: var obj= {'name':'小军',age:23};
     *  调用: toQueryString(obj);
     *  返回: "?name=%E5%B0%8F%E5%86%9B&age=23"
     */
    private toQueryString(obj) {
        let ret = [];
        for (let key in obj) {
            key = encodeURIComponent(key);
            let values = obj[key];
            if (values && values.constructor == Array) {//数组
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            } else { //字符串
                ret.push(this.toQueryPair(key, values));
            }
        }
        return ret.join('&') ? ('?' + ret.join('&')) : '';
    }

    /**
     *
     * @param obj
     * @return {string}
     *  声明: var obj= {'name':'小军',age:23};
     *  调用: toQueryString(obj);
     *  返回: "name=%E5%B0%8F%E5%86%9B&age=23"
     */
    // private toBodyString(obj) {
    //     let ret = [];
    //     for (let key in obj) {
    //         key = encodeURIComponent(key);
    //         let values = obj[key];
    //         if (values && values.constructor == Array) {//数组
    //             let queryValues = [];
    //             for (let i = 0, len = values.length, value; i < len; i++) {
    //                 value = values[i];
    //                 queryValues.push(this.toQueryPair(key, value));
    //             }
    //             ret = ret.concat(queryValues);
    //         } else { //字符串
    //             ret.push(this.toQueryPair(key, values));
    //         }
    //     }
    //     return ret.join('&');
    // }

    private toQueryPair(key, value) {
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }
}