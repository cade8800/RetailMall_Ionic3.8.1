import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { OrderDetailPage } from '../order-detail/order-detail';
import { OrderService } from '../../providers/orderService';
import { AccountService } from '../../providers/accountService';
import { BasePage } from '../../providers/basePage';
import { LoadCtrl } from '../../providers/loadingController';

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
  providers: [OrderService, AccountService, LoadCtrl]
})
export class OrderListPage extends BasePage {

  isLoad: boolean = true;
  params: any = {
    pageIndex: 1,
    pageSize: 10
  };
  orderList: any = [];
  private orderStateList: any = [{
    type: 'radio',
    label: '全部',
    value: -1,
    checked: true
  }, {
    type: 'radio',
    label: '待付款',
    value: 0,
    checked: false
  }, {
    type: 'radio',
    label: '已完成',
    value: 1,
    checked: false
  }];
  private orderSortList: any = [{
    type: 'radio',
    label: '按下单时间排序',
    value: '0',
    checked: true
  }, {
    type: 'radio',
    label: '按出发时间排序',
    value: '1',
    checked: false
  }];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loading: LoadCtrl,
    private orderService: OrderService,
    public accountService: AccountService) {
    super(accountService);
    this.init();
  }

  private init() {
    this.getOrderList("", true);
  }

  orderState() {
    let alert = this.alertCtrl.create();
    alert.setTitle('订单状态');
    this.orderStateList.forEach(element => {
      alert.addInput(element);
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.selectOrderByState(data);
      }
    });
    alert.present();
  }

  private selectOrderByState(state: number) {
    this.orderStateList.forEach(element => {
      if (element.value == state)
        element.checked = true;
      else element.checked = false;
    });
    if (state == -1) {
      this.params = {
        pageIndex: 1,
        pageSize: 10
      };
      this.orderList = [];
      this.isLoad = true;
      this.getOrderList('', true);
    } else {
      this.params = {
        pageIndex: 1,
        pageSize: 10,
        PaymentState: state
      };
      this.orderList = [];
      this.isLoad = true;
      this.getOrderList('', true);
    }
  }


  orderSorting() {
    let alert = this.alertCtrl.create();
    alert.setTitle('订单排序');
    this.orderSortList.forEach(element => {
      alert.addInput(element);
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.orderByOrderList(data);
      }
    });
    alert.present();
  }

  private orderByOrderList(sort: number) {
    this.orderSortList.forEach(element => {
      if (element.value == sort)
        element.checked = true;
      else element.checked = false;
    });
    this.params = {
      pageIndex: 1,
      pageSize: 10,
      SortingWay: sort
    };
    this.orderList = [];
    this.isLoad = true;
    this.getOrderList('', true);
  }

  goOrderDetail(orderId: string) {
    if (orderId)
      this.navCtrl.push(OrderDetailPage, { orderId: orderId, source: 'orderlist' });
  }

  private getOrderList(infiniteScroll: any, isShowLoad: boolean) {
    if (isShowLoad) this.loading.show();
    this.orderService.getList(this.params).then(response => {
      if (response.Success && response.Result) {
        this.params.pageIndex++;
        let oList = response.Result.Items;
        if (oList.length < this.params.pageSize) {
          this.isLoad = false;
        } else { this.isLoad = true; }
        if (this.orderList.length > 0) {
          this.orderList = this.orderList.concat(oList);
        } else {
          this.orderList = oList;
        }
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      if (isShowLoad) this.loading.hide();
    }).catch(err => console.log(err));
  }

  doInfinite(infiniteScroll) {
    this.getOrderList(infiniteScroll, false);
  }

}
