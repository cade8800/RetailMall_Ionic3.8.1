import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { LinePage } from '../line/line';
import { HotelPage } from '../hotel/hotel';
import { TicketPage } from '../ticket/ticket';
import { AccountPage } from '../account/account';
import { OrderDetailPage } from '../order-detail/order-detail';
import { AgencyService } from '../../providers/agencyService';
import { ProductService } from '../../providers/productService';
import { AccountService } from '../../providers/accountService';
import { Default_Agency_Img, Default_Product_Img } from "../../providers/constants";
import { BasePage } from '../../providers/basePage';
import { LoadCtrl } from '../../providers/loadingController';
import * as clipboard from 'clipboard';
import { ToastCtrl } from '../../providers/toastController';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AgencyService, ProductService, AccountService, LoadCtrl]
})

export class HomePage extends BasePage {

  constructor(public navCtrl: NavController,
    private agencyService: AgencyService,
    private productService: ProductService,
    public accountService: AccountService,
    private loading: LoadCtrl,
    private toastCtrl: ToastCtrl) {
    super(accountService);
    this.init();
  }

  ionViewDidEnter() {
    if (this.agencyInfo.AgencyName)
      this.uutShareInit(this.agencyInfo.AgencyName, this.agencyInfo.AgencyImg);
  }

  agencyInfo: any = {};
  hotProductList: any = [];
  productList: any = [];
  isLoad: boolean = true;
  agencyId: string;
  pageIndex: number = 1;
  pageSize: number = 10;
  clip: any;
  toaster: any;

  /**
   * 初始化
   */
  private init() {
    this.agencyId = this.getAgencyId();
    if (this.agencyId) {
      this.loading.show();
      this.agencyService.getInfo(this.agencyId)
        .then(response => {
          if (response.Success) {
            if (this.goProductDetail(this.getUrlParam('ptype'), this.getUrlParam('pid'))) this.loading.hide();
            if (this.goOrderDetail(this.getUrlParam('orderid'))) this.loading.hide();
            this.agencyInfo = response.Result;
            AgencyService.CurrentAgency = response.Result;
            localStorage.setItem("agencyName", this.agencyInfo.AgencyName);
            this.saveAgencyTel(this.agencyInfo.TelePhone);
            this.setDefaultAgencyImg();
            this.uutShareInit(this.agencyInfo.AgencyName, this.agencyInfo.AgencyImg);
            this.productService.getList({ PageIndex: 1, PageSize: 10, SupplierId: this.agencyId, IsHot: true })
              .then(hotList => {
                if (hotList.Success) {
                  this.hotProductList = hotList.Result.Items;
                  this.setDefaultHotProductImg();
                  this.getAllProductList('', true);
                  this.copyWechatNum();
                }
              }).catch();
          }
        }).catch();
    }
  }

  private saveAgencyTel(tel: string) {
    localStorage.setItem("agencyTel", tel);
  }

  private setDefaultAgencyImg() {
    if (!this.agencyInfo.AgencyImg) {
      this.agencyInfo.AgencyImg = Default_Agency_Img;
    } else {
      this.agencyInfo.AgencyImg = "data:image/png;base64," + this.agencyInfo.AgencyImg;
    }
  }

  private setDefaultHotProductImg() {
    this.hotProductList.forEach(item => {
      if (!item.CoverImage) item.CoverImage = Default_Product_Img;
    });
  }

  /**
   * 获取所有产品
   * @param infiniteScroll 
   */
  getAllProductList(infiniteScroll: any, isShowLoading: boolean) {
    this.productService.getList({ PageIndex: this.pageIndex, PageSize: this.pageSize, SupplierId: this.agencyId })
      .then(response => {
        if (response.Success) {
          this.pageIndex++;
          let pList = response.Result.Items;
          pList.forEach(element => {
            if (!element.CoverImage) {
              element.CoverImage = Default_Product_Img;
            }
          });
          if (pList.length < this.pageSize) {
            this.isLoad = false;
          } else { this.isLoad = true; }
          if (this.productList.length > 0) {
            this.productList = this.productList.concat(pList);
          } else {
            this.productList = pList;
          }
        }
        if (infiniteScroll) infiniteScroll.complete();
        if (isShowLoading) this.loading.hide();
      }).catch();
  }

  /**
   * 我的账户入口
   */
  goMyAccount() {
    this.navCtrl.push(AccountPage);
  }

  /**
   * 查询入口
   */
  searchBtnClick() {
    this.navCtrl.push(SearchPage, { msg: {} });
  }

  /**
   * 推荐产品入口
   */
  recommendBtnClick() {
    this.navCtrl.push(SearchPage, { msg: { IsHot: true } });
  }

  /**
   * 所有产品入口
   */
  productBtnClick() {
    this.navCtrl.push(SearchPage, { msg: {} });
  }

  /**
   * 产品类别查询入口
   * @param type 
   */
  productCategoryBtnClick(type: string) {
    if (type) this.navCtrl.push(SearchPage, { msg: { ProductType: type } });
  }

  /**
   * 产品详情入口
   * @param type 
   * @param productId 
   */
  goProductDetail(type: string, productId: string): boolean {
    if (type && productId) {
      if (type == "线路" || type.toLowerCase() == 'line') {
        this.navCtrl.push(LinePage, { productId: productId });
        return true;
      } else if (type == "酒店" || type.toLowerCase() == 'hotel') {
        this.navCtrl.push(HotelPage, { productId: productId });
        return true;
      } else if (type == "门票" || type.toLowerCase() == 'ticket') {
        this.navCtrl.push(TicketPage, { productId: productId });
        return true;
      } return false;
    } return false;
  }

  goOrderDetail(orderId: string): boolean {
    if (orderId) {
      this.navCtrl.push(OrderDetailPage, { orderId: orderId, source: 'home' });
      return true;
    } return false;
  }

  /**
   * 滚动加载
   * @param infiniteScroll 
   */
  doInfinite(infiniteScroll) {
    this.getAllProductList(infiniteScroll, false);
  }

  /**
   * 复制微信号
   */
  private copyWechatNum() {
    let wechatNum = this.agencyInfo.WeChat;
    let that = this;
    this.clip = new clipboard("#copyWechatBtn", {
      text: function (trigger) {
        return wechatNum;
      }
    });
    this.clip.on('success', function (e) {
      that.toastCtrl.show("复制成功");
      e.clearSelection();
    });
    this.clip.on('error', function (e) { });
  }

}
