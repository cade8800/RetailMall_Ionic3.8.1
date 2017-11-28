import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LinePage } from '../line/line';
import { HotelPage } from '../hotel/hotel';
import { TicketPage } from '../ticket/ticket';
import { ProductService } from '../../providers/productService';
import { Default_Product_Img } from '../../providers/constants';
import { BasePage } from '../../providers/basePage';
import { AccountService } from '../../providers/accountService';
import { LoadCtrl } from '../../providers/loadingController';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [ProductService, AccountService, LoadCtrl]
})
export class SearchPage extends BasePage {

  items = [];
  isLoad: boolean = true;
  params: any = {};
  agencyId: string;
  productList: any = [];
  showcondition: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public productService: ProductService,
    private loading: LoadCtrl,
    public accountService: AccountService) {
    super(accountService);
    this.init();
  }

  init() {
    this.agencyId = localStorage.getItem("agencyId");
    if (this.agencyId) {
      this.params = this.navParams.get('msg');
      this.params.PageIndex = 1;
      this.params.PageSize = 10;
      this.params.SupplierId = this.agencyId;
      this.params.KeyWord = "";
      this.getProduct('', true);
    }
  }

  getfocus() {
    if (this.params.KeyWord) {
      this.showcondition = false;
    } else { this.showcondition = true; }
  }

  ionInput() {
    this.productList = [];
    this.params.PageIndex = 1;
    this.isLoad = true;
    if (this.params.KeyWord) {
      this.showcondition = false;
    } else { this.showcondition = true; }
    this.getProduct('', true);
  }

  getProduct(infiniteScroll, isShowLoad: boolean) {
    if (this.params.SupplierId) {
      if (isShowLoad) this.loading.show();
      this.productService.getList(this.params)
        .then(response => {
          if (response.Success) {
            this.params.PageIndex++;
            let pList = response.Result.Items;
            pList.forEach(element => {
              if (!element.CoverImage) {
                element.CoverImage = Default_Product_Img;
              }
            });
            if (pList.length < this.params.PageSize) {
              this.isLoad = false;
            } else { this.isLoad = true; }
            if (this.productList.length > 0) {
              this.productList = this.productList.concat(pList);
            } else {
              this.productList = pList;
            }
          }
          if (infiniteScroll) infiniteScroll.complete();
          if (isShowLoad) this.loading.hide();

        }).catch();
    }
  }

  doInfinite(infiniteScroll) {
    this.getProduct(infiniteScroll, false);
  }

  categorySearch(type: string) {
    if (type) {
      this.productList = [];
      this.params.PageIndex = 1;
      this.params.ProductType = type;
      this.showcondition = false;
      this.isLoad = true;
      this.getProduct('', true);
    }
  }

  /**
 * 产品详情入口
 * @param type 
 * @param productId 
 */
  goProductDetail(type: string, productId: string) {
    if (type && productId) {
      if (type == "线路") {
        this.navCtrl.push(LinePage, { productId: productId });
      } else if (type == "酒店") {
        this.navCtrl.push(HotelPage, { productId: productId });
      } else if (type == "门票") {
        this.navCtrl.push(TicketPage, { productId: productId });
      }
    }
  }

}
